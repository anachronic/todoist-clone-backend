import { hash } from 'bcrypt'
import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class User extends BaseEntity {
  // Read https://www.npmjs.com/package/bcrypt#a-note-on-rounds
  static SALT_ROUNDS = 11

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column()
  name: string

  @Field(() => String)
  @Column({ nullable: true })
  lastName: string

  @Column({ nullable: false })
  hashedPassword: string

  @Field(() => String)
  @Column({ nullable: false })
  email: string

  static async generateHashedPassword(password: string): Promise<string> {
    return await hash(password, this.SALT_ROUNDS)
  }
}
