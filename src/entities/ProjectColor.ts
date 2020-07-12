import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class ProjectColor extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column({ type: 'int' })
  @Field()
  red: number

  @Column({ type: 'int' })
  @Field()
  green: number

  @Column({ type: 'int' })
  @Field()
  blue: number

  @Column()
  @Field()
  name: string

  @Field()
  hex: string
}
