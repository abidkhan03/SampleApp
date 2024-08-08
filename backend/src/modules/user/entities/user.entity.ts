import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { PasswordTransformer } from '../../common/transformer/password-transformer';
import { Order } from '../../orders/entities/order.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({
    name: 'password',
    length: 100,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password: string;

  @OneToMany(() => Order, orders => orders.user, {
    cascade: true,
  })
  orders: Order[];

}