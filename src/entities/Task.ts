import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { dateTransformer } from './transformers'
import { User } from './User'

@Entity()
@ObjectType()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column()
  @Field(() => String)
  text: string

  @Column({ default: false })
  @Field(() => Boolean)
  done: boolean

  @Column({
    type: 'date',
    nullable: true,
    transformer: dateTransformer,
  })
  @Field(() => Date, { nullable: true })
  schedule?: Date

  @ManyToOne(() => User, (user) => user.tasks, { lazy: true })
  @Field(() => User)
  user: Promise<User> | User
}
