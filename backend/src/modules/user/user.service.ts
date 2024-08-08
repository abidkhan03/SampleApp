import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Hash } from '../utils/hash.util';
import { SigninDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async get(userId: number) {
    return this.userRepository.findOne({
      where: { userId },
    });
  }

  async getByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async create(createUser: CreateUserDto): Promise<UserEntity> {
    const userExists = await this.getByEmail(createUser.email);
    if (userExists) {
      throw new NotAcceptableException('Provided Email already exists!');
    }
    if (createUser.password !== createUser.passwordConfirmation) {
      throw new NotAcceptableException('Passwords do not match!');
    }

    const newUser = this.userRepository.create({
      ...createUser,
    });

    return await this.userRepository.save(newUser);
  }

  async updateUser(requestingUserId: number, targetUserId: number, body: UpdateUserDto): Promise<UserEntity> {
    // Coerce both IDs to numbers for safe comparison
    const reqUserId = Number(requestingUserId);
    const tarUserId = Number(targetUserId);

    const requestingUser = await this.userRepository.findOne({ where: { userId: reqUserId }, relations: ['role'] });
    const targetUser = await this.userRepository.findOne({ where: { userId: tarUserId }, relations: ['role'] });

    if (!requestingUser || !targetUser) {
      throw new NotAcceptableException('User not found!');
    }

    // Ensure client is updating only their profile and admins can update any profile including other admins
    if (reqUserId === tarUserId) {
      const updated = await this.userRepository.update(tarUserId, body);
      return this.get(tarUserId); // Fetch updated user data
    } else {
      console.error('Unauthorized access attempt:', { requestingUserId: reqUserId, targetUserId: tarUserId});
      throw new UnauthorizedException('You do not have permission to update this user.');
    }
  }

  async paginate(page = 1): Promise<any> {
    const take = 15;
    const [users, total] = await this.userRepository.findAndCount({
      relations: ['role'],
      take,
      skip: (page - 1) * take,
    });
    console.log('users: ', users);
    console.log('total: ', total);
    return {
      data: users,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      }
    }
  }


  async createToken(user: UserEntity) {
    return {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: user.userId }),
      user,
    };
  }

  async validateUser(signinDto: SigninDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: signinDto.email },
    });
    if (!user || !Hash.compare(signinDto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    return user;
  }
}
