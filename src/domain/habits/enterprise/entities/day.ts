import { Entity } from "@/domain/core/entity"
import { UniqueEntityID } from "@/domain/core/unique-entity-id"
import { Habit } from "./habit"
import { Optional } from "@/domain/core/types/optional"
import { Goal } from "./goal"

export interface DayProps {
  date: Date
  habits: Habit[]
  goals: Goal[]
}

export class Day extends Entity<DayProps> {

  get date() {
    return this.props.date
  }

  set date(date: Date) {
    this.props.date = date
  }

  get habits() {
    return this.props.habits
  }

  get goals() {
    return this.props.goals
  }

  set habits(habits: Habit[]) {
    this.props.habits = habits
  }

  set goals(goals: Goal[]) {
    this.props.goals = goals
  }

  static create(props: Optional<DayProps, 'habits' | 'goals'>, id?: UniqueEntityID) {
    const day = new Day({
      date: props.date ?? new Date(),
      habits: props.habits ?? [],
      goals : props.goals ?? [],
      ...props
    }, id)
    return day
  }
}