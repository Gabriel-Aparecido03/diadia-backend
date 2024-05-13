export function startOfTheDay(date: Date) {
  const startOfTheDay = date.setHours(0, 0, 0, 0)
  return new Date(startOfTheDay)
}