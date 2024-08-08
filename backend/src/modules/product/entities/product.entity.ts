import { Order } from "@modules/orders/entities/order.entity";
import { Category } from "../../category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name: 'products'
})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 }) 
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Category, category => category.products)
    category: Category;

    @OneToMany(() => Order, (order) => order.product)
    orders: Order[];

}
