import { InputType, Field } from 'type-graphql'
import { Project } from '../../entities/Project'

@InputType()
export class ProjectCreateInput implements Partial<Project> {
  @Field()
  name: string
}
