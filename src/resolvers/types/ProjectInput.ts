import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export class ProjectInput {
  @Field({ defaultValue: false })
  includeInbox: boolean
}
