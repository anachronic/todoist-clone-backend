import { Field, InputType } from 'type-graphql'
import { User } from '../../entities/User'
import { IsEmail } from 'class-validator'

@InputType({ description: 'Create user input' })
export class CreateUserInput implements Partial<User> {
  @Field()
  name: string

  @Field({ nullable: true })
  lastName: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  password: string

  @Field()
  passwordConfirmation: string
}
