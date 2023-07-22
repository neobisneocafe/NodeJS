import { BaseEntity } from "src/base/base.entity";
import { Category } from "src/modules/category/entities/category.entity";
import { Image } from "src/modules/image/entities/image.entity";
import { Column, JoinColumn, ManyToOne, OneToOne } from "typeorm";

export class Dish extends BaseEntity{
    @Column()
    name:string

    @Column()
    description:string

    @Column()
    price:string

    @OneToOne(()=>Image,(image)=>image.dish)
    @JoinColumn()
    image:Image

    @ManyToOne(()=>Category,(category)=>category.dish)
    category:Category
}
