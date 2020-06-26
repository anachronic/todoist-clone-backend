import { Arg, Mutation, Resolver, Ctx } from 'type-graphql'
import { User } from '../entities/User'
import { AccessTokenSessionInput } from './types/AccessTokenSessionInput'
import { ServerContext } from '../config/apollo'

@Resolver()
export class SessionResolver {
  @Mutation(() => String, { nullable: true })
  async obtainAuthToken(
    @Arg('user') { email, password }: AccessTokenSessionInput,
    @Ctx() { response }: ServerContext
  ): Promise<string | null> {
    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) {
      return null
    }

    const accessToken = user.createAccessToken()
    response.cookie('refreshtoken', user.createRefreshToken(), {
      httpOnly: true,
    })
    return accessToken
  }
}
