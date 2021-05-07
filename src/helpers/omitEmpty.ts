import _ from 'lodash'

const omitEmpty = <T extends object>(obj: T): T => _.omitBy(obj, _.isNil) as T

export default omitEmpty
