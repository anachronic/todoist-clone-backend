export class EntityAlreadyExistsError extends Error {
  name = 'EntityAlreadyExistsError'

  constructor(reason: string) {
    super()

    Object.setPrototypeOf(this, EntityAlreadyExistsError.prototype)
    this.message = reason
  }
}
