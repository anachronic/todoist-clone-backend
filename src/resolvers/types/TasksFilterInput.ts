import { InputType, Field } from 'type-graphql'

@InputType()
export class TasksFilterInput {
  @Field(() => Boolean, { nullable: true })
  done?: boolean

  @Field({ nullable: true })
  projectId?: string

  @Field({ nullable: true })
  forToday?: boolean
}
