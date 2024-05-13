import { Entity } from "@/domain/core/entity"
import { Optional } from "@/domain/core/types/optional"
import { UniqueEntityID } from "@/domain/core/unique-entity-id"

export interface UserProps {
  name: string
  password: string
  email: string
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  set password(password : string) {
    this.props.password = password
    this.touch()
  }

  set name(name : string) {
    this.props.name = name
    this.touch()
  }

  set email(email : string) {
    this.props.email = email
    this.touch()
  }

  static create(props: Optional<UserProps,'createdAt' | 'updatedAt'>, id ?: UniqueEntityID) {
    const user = new User({
      createdAt : props.createdAt ?? new Date(),
      updatedAt : props.updatedAt ?? null,
      ...props
    },id)
    return user
  }
}