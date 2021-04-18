import { AxiosError } from 'axios'
import { Maybe } from '../types'

const omitNotFoundError = async <T>(promise: Promise<T>): Maybe<T> => {
  try {
    return await promise
  } catch (e) {
    const error: AxiosError = e

    if (error.isAxiosError && error.response && error.response.status === 404) {
      return
    }

    throw e
  }
}

export default omitNotFoundError
