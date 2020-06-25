import { InputType, Field } from 'type-graphql'
import { User } from '../../entities/User'

@InputType({ description: 'Create user input' })
export class CreateUserInput implements Partial<User> {
  @Field()
  name: string

  @Field({ nullable: true })
  lastName: string

  @Field()
  email: string

  @Field()
  password: string

  @Field()
  passwordConfirmation: string
}
