import { Field, InputType } from 'type-graphql'
import { Project } from '../../entities/Project'

@InputType()
export class ProjectUpdateInput implements Omit<Partial<Project>, 'id' | 'colorId'> {
  @Field(() => String)
  id: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  colorId?: string
}
