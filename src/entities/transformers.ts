import { ValueTransformer } from 'typeorm'
import moment from 'moment'

export const dateTransformer: ValueTransformer = {
  to: (value: Date) => value,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (value?: any) => {
    if (value) {
      return moment(value).utcOffset(0, true).toDate()
    }
    return value
  },
}

export const dateTimeTransformer: ValueTransformer = {
  to: (value: Date) => value,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (value?: any) => {
    if (value) {
      return moment(value).toDate()
    }
    return value
  },
}
