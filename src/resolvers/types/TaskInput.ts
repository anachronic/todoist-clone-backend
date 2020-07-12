import { Field, InputType } from 'type-graphql'
import { Task } from '../../entities/Task'
import { ISODate } from './DateType'

@InputType()
export class TaskInput implements Omit<Partial<Task>, 'id'> {
  @Field(() => String)
  id: string

  @Field({ nullable: true })
  text?: string

  @Field(() => Boolean, { nullable: true })
  done?: boolean

  @Field(() => ISODate, { nullable: true })
  schedule?: Date
}
