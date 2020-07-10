import { GraphQLScalarType, Kind } from 'graphql'

export const ISODate = new GraphQLScalarType({
  name: 'ISODate',
  description: 'An ISO-8601 date',
  parseValue(isoDate: string) {
    return new Date(isoDate)
  },
  serialize(date: Date) {
    return date.toJSON()
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseLiteral(ast: any) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }

    return null
  },
})
