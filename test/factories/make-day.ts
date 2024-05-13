import { UniqueEntityID } from "@/domain/core/unique-entity-id"
import { Day, DayProps } from "@/domain/habits/enterprise/entities/day"
import { faker } from "@faker-js/faker"
import { makeHabit } from "./make-habit"

export function makeDay(
  override: Partial<DayProps> = {},
  id?: UniqueEntityID,
) {
  const day = Day.create(
    {
      date : faker.date.anytime(),
      habits : [],
      ...override,
    },
    id,
  )

  return day
}