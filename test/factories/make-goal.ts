import { UniqueEntityID } from "@/domain/core/unique-entity-id"
import { Day } from "@/domain/habits/enterprise/entities/day"
import { GoalProps, Goal } from "@/domain/habits/enterprise/entities/goal"
import { PrismaGoalMapper } from "@/infra/database/prisma/mapper/prisma-goal-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeGoal(
  override: Partial<GoalProps> = {},
  id?: UniqueEntityID,
) {
  const goal = Goal.create(
    {
      name: faker.lorem.text(),
      description: faker.lorem.text(),
      userId: new UniqueEntityID(),
      deadline: Day.create({ date: new Date() }),
      ...override,
    },
    id,
  )

  return goal
}

@Injectable()
export class GoalFactory {
  constructor(private prismaService: PrismaService) { }

  async execute({ createdAt, deadline, description, id, name, updatedAt, userId }: Goal) {
    const day = await this.prismaService.day.create({ data: { date: deadline.date } })
    await this.prismaService.goal.create({
      data: {
        description,
        createdAt,
        name,
        updatedAt,
        user_id : userId.toString(),
        day_id :day.id,
        id : id.toString()
      }
    })
  }
}