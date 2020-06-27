import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
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

  @ManyToOne(() => User, (user) => user.tasks, { lazy: true })
  @Field(() => User)
  user: Promise<User> | User
}
