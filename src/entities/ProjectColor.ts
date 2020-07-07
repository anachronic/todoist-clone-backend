import { BaseEntity, PrimaryGeneratedColumn, Entity, Column } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

@Entity()
@ObjectType()
export class ProjectColor extends BaseEntity {
  @PrimaryGeneratedColumn()
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
