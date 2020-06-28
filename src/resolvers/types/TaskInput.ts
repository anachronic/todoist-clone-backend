import { Field, InputType } from 'type-graphql'
import { Task } from '../../entities/Task'

@InputType()
export class TaskInput implements Partial<Task> {
  @Field(() => Number)
  id: number

  @Field({ nullable: true })
  text?: string

  @Field(() => Boolean, { nullable: true })
  done?: boolean

  @Field({ nullable: true })
  schedule?: Date
}
