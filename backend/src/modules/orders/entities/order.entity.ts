import { Product } from "@modules/product/entities/product.entity";
import { UserEntity } from "@modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name: 'orders'
})
export class Order {    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderDate: Date;

    @ManyToOne(() => Product, (product) => product.orders)
    product: Product;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    user: UserEntity;

    @Column()
    quantity: number;
}
