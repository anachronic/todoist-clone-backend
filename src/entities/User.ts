import { hash, compare } from 'bcrypt'
import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { sign } from 'jsonwebtoken'
import { Task } from './Task'

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

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastName: string

  @Column({ nullable: false })
  hashedPassword: string

  @Field(() => String)
  @Column({
    nullable: false,
    unique: true,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    },
  })
  email: string

  @OneToMany(() => Task, (task) => task.user, { lazy: true })
  @Field(() => [Task])
  tasks: Task[] | Promise<Task[]>

  // instance methods
  async comparePassword(password: string): Promise<boolean> {
    return await compare(password, this.hashedPassword)
  }

  createAccessToken(): string {
    return sign(
      {
        userId: this.id,
        email: this.email,
        name: this.name,
        lastName: this.lastName,
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: '15m',
      }
    )
  }

  createRefreshToken(): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sign({ userId: this.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })
  }

  // Non active record static methods
  static async generateHashedPassword(password: string): Promise<string> {
    return await hash(password, this.SALT_ROUNDS)
  }
}
