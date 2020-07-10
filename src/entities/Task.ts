import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Project } from './Project'
import { dateTransformer } from './transformers'

@Entity()
@ObjectType()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
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

  @ManyToOne(() => Project, (project) => project.tasks, { lazy: true })
  project: Promise<Project> | Project
}
