import { Entity } from "@/domain/core/entity"
import { Optional } from "@/domain/core/types/optional"
import { UniqueEntityID } from "@/domain/core/unique-entity-id"
import { Day } from "./day"
import { WeekdayList } from "./weekday-list"

export interface HabitProps {
  name: string
  description: string
  createdAt: Date
  userId : UniqueEntityID
  updatedAt?: Date | null
  weekdays : WeekdayList
}

export class Habit extends Entity<HabitProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get weekdays() {
    return this.props.weekdays
  }

  get createdAt() {
    return this.props.createdAt
  }

  get userId() {
    return this.props.userId
  }

  get updatedAt() {
    return this.props.updatedAt
  } 

  touch() {
    this.props.updatedAt = new Date()
  }

  set description(description : string) {
    this.props.description = description
    this.touch()
  }

  set name(name : string) {
    this.props.name = name
    this.touch()
  }

  set weekdays(weekdays: WeekdayList) {
    this.props.weekdays = weekdays
  }

  static create(props: Optional<HabitProps,'createdAt' | 'updatedAt' | 'weekdays'>, id ?: UniqueEntityID) {
    const habit = new Habit({
      createdAt : props.createdAt ?? new Date(),
      updatedAt : props.updatedAt ?? null,
      weekdays : props.weekdays ?? new WeekdayList([]),
      ...props
    },id)
    return habit
  }
}