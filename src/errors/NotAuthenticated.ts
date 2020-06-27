export class NotAuthenticated extends Error {
  constructor(message = 'Not authenticated') {
    super(message)
  }
}
