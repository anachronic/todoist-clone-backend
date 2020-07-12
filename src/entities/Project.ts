import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProjectColor } from './ProjectColor'
import { Task } from './Task'
import { User } from './User'

@Entity()
@ObjectType()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column()
  @Field(() => String)
  name: string

  @ManyToOne(() => User, (user) => user.projects, { lazy: true })
  @Field(() => [User])
  user: Promise<User> | User

  @OneToMany(() => Task, (task: Task) => task.project, { lazy: true })
  @Field(() => [Task])
  tasks: Promise<Task[]> | Task[]

  @ManyToOne(() => ProjectColor, { nullable: true, lazy: true })
  @Field(() => ProjectColor, { nullable: true })
  color: Promise<ProjectColor> | ProjectColor
}
