import { Entity } from "@/domain/core/entity"
import { Optional } from "@/domain/core/types/optional"
import { UniqueEntityID } from "@/domain/core/unique-entity-id"
import { Day } from "./day"

export interface GoalProps {
  name: string
  description: string
  userId : UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
  deadline : Day
}

export class Goal extends Entity<GoalProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deadline() {
    return this.props.deadline
  }

  get userId() {
    return this.props.userId
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

  set deadline(deadline : Day) {
    this.props.deadline = deadline
    this.touch()
  }

  static create(props: Optional<GoalProps,'createdAt' | 'updatedAt'>, id ?: UniqueEntityID) {
    const goal = new Goal({
      createdAt : props.createdAt ?? new Date(),
      updatedAt : props.updatedAt ?? null,
      ...props
    },id)
    return goal
  }
}