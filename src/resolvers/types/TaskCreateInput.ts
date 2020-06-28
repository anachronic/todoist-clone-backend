import { Field, InputType } from 'type-graphql'
import { Task } from '../../entities/Task'

@InputType()
export class TaskCreateInput implements Partial<Task> {
  @Field()
  text: string

  @Field(() => Number, { nullable: true })
  projectId?: number
}
