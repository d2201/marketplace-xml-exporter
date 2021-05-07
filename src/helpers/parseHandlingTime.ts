const DEFAULT_HANDLING_TIME = { unit: 'days' as const, amount: 30 }

const parseHandlingTime = (
  handlingTime: string | undefined,
): { unit: 'hours' | 'days'; amount: number } => {
  if (!handlingTime) {
    return DEFAULT_HANDLING_TIME
  }

  const hours = handlingTime.match(/(\d+)H/)?.[1]
  const days = handlingTime.match(/(\d+)D/)?.[1]

  if (days) {
    return { unit: 'days', amount: +days }
  }

  if (hours) {
    return { unit: 'hours', amount: +hours }
  }

  return DEFAULT_HANDLING_TIME
}

export default parseHandlingTime
