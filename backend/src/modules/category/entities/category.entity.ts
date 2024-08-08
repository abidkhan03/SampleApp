import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Product } from "../../product/entities/product.entity";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 50 })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]

}
