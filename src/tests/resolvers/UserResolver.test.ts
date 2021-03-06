/* eslint-disable no-empty */
import { graphql, GraphQLError, GraphQLSchema } from 'graphql'
import { getRepository } from 'typeorm'
import { createSchema, formatGraphQLError } from '../../config/apollo'
import { User } from '../../entities/User'

let schema: GraphQLSchema

beforeAll(async () => {
  schema = await createSchema()
})

describe('The User resolver', () => {
  describe('Creating a user', () => {
    it('Validates that email is valid', async () => {
      const repository = getRepository(User)
      const query = `
          mutation register(
            $email: String!
            $name: String!
            $password: String!
            $passwordConfirmation: String!
          ) {
            registerUser(
              user: {
                email: $email
                name: $name
                password: $password
                passwordConfirmation: $passwordConfirmation
              }
            ) {
              name
              id
              email
            }
          }`

      const response = await graphql({
        schema,
        source: query,
        variableValues: {
          email: 'johndo',
          name: 'john',
          password: '123456',
          passwordConfirmation: '123456',
        },
      })

      expect(response).toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([expect.any(GraphQLError)]),
        })
      )

      const error = response.errors![0]
      expect(error).toBeTruthy()

      expect(formatGraphQLError(error)).toEqual(
        expect.objectContaining({
          extensions: {
            code: 'GRAPHQL_VALIDATION_FAILED',
            messages: ['email must be an email'],
          },
        })
      )

      expect(await repository.count()).toEqual(0)
    })

    it('Does not create user if email already exists', async () => {
      const repository = getRepository(User)

      await repository.save(
        repository.create({
          name: 'john doe',
          email: 'john@doe.com',
          hashedPassword: '1',
        })
      )
      const mutation = `
        mutation register(
          $email: String!
          $name: String!
          $password: String!
          $passwordConfirmation: String!
        ) {
          registerUser(
            user: {
              email: $email
              name: $name
              password: $password
              passwordConfirmation: $passwordConfirmation
            }
          ) {
            name
            id
            email
          }
        }`
      const result = await graphql({
        source: mutation,
        schema,
        variableValues: {
          email: 'john@doe.com',
          name: 'whatever',
        },
      })

      expect(result.data).toBeFalsy()
      expect(await repository.count()).toEqual(1)
    })
  })
})
