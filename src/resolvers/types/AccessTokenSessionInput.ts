import { IsEmail } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class AccessTokenSessionInput {
  @IsEmail()
  @Field()
  email: string

  @Field(() => String)
  password: string
}
