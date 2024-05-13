import { Entity } from "@/domain/core/entity"
import { Optional } from "@/domain/core/types/optional"
import { UniqueEntityID } from "@/domain/core/unique-entity-id"

export interface WeekdayProps {
  weekday: number
  createdAt: Date
  timeInSeconds: Number
  habitId: UniqueEntityID
}

export class Weekday extends Entity<WeekdayProps> {

  get weekday() {
    return this.props.weekday
  }

  get timeInSeconds() {
    return this.props.timeInSeconds
  }

  get createdAt() {
    return this.props.createdAt
  }

  get habitId() {
    return this.props.habitId
  }

  set weekday(weekday: number) {
    this.props.weekday = weekday
  }

  set habitId(habitId: UniqueEntityID) {
    this.props.habitId = habitId
  }

  set timeInSeconds(timeInSeconds: Number) {
    this.props.timeInSeconds = timeInSeconds
  }

  static create(props: Optional<WeekdayProps, 'createdAt'>, id?: UniqueEntityID) {
    const weekday = new Weekday({
      createdAt: props.createdAt ?? new Date(),
      ...props
    }, id)
    return weekday
  }
}