import { BaseEntity } from "src/base/base.entity";
import { Column } from "typeorm";

export class Employee extends BaseEntity {
    @Column()
    firstName:string

    
}
