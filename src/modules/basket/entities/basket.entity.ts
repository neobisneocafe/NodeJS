import { BaseEntity } from 'src/base/base.entity';
import { BranchEntity } from 'src/modules/branch/entities/branch.entity';
import { Dish } from 'src/modules/dishes/entities/dish.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Basket extends BaseEntity {
  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => BranchEntity, (branch) => branch.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  branch: BranchEntity;

  @ManyToMany(() => Dish)
  @JoinTable()
  dishes: Dish[];

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @Column()
  dishesPrice: number;

  @Column()
  overall: number;

  @Column({ default: 0 })
  bonusPoints: number;
}
