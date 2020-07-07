export class NotAuthenticated extends Error {
  name = 'NotAuthenticated'

  constructor(message = 'Not authenticated') {
    super(message)
  }
}
