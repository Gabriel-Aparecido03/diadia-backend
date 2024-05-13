import { Goal } from "@/domain/habits/enterprise/entities/goal"

export class GoalPresenter {
  toHttp({ createdAt, description, id, name, updatedAt, userId, deadline }: Goal) {
    return {
      id : id.toString(),
      name,
      description,
      createdAt,
      updatedAt,
      userId : userId.toString(),
      deadline : deadline.date
    }
  }
}