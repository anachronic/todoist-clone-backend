import { Field, InputType } from 'type-graphql'
import { Task } from '../../entities/Task'

@InputType()
export class TaskCreateInput implements Partial<Task> {
  @Field()
  text: string

  @Field(() => String, { nullable: true })
  projectId?: string
}
