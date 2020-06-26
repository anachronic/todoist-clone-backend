import { Arg, Mutation, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import { AccessTokenSessionInput } from './types/AccessTokenSessionInput'

@Resolver()
export class SessionResolver {
  @Mutation(() => String, { nullable: true })
  async obtainAuthToken(
    @Arg('user') { email, password }: AccessTokenSessionInput
  ): Promise<string | null> {
    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) {
      return null
    }

    return 'dale go'
  }
}
