import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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

  // Active Record
  static async findProjectOrInbox(user: User, id?: number): Promise<Project> {
    let project

    const qb = this.createQueryBuilder('project')

    if (id) {
      qb.where('project.id = :id', { id })
    } else {
      qb.where('project.name = :name', { name: 'Inbox' })
    }

    project = await qb.andWhere('project.user = :userId', { userId: user.id }).getOne()

    if (!project) {
      project = this.create({ name: 'Inbox', user: { id: user.id } })
      await project.save()
    }

    return project
  }
}
