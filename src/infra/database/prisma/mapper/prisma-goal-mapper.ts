import { UniqueEntityID } from "@/domain/core/unique-entity-id";
import { Day } from "@/domain/habits/enterprise/entities/day";
import { Goal } from "@/domain/habits/enterprise/entities/goal";
import { Goal as PrismaGoal } from "@prisma/client";

export class PrismaGoalMapper {
  toDomain({ createdAt, description, id, name, updatedAt, user_id }: PrismaGoal): Goal {
    return Goal.create({
      deadline: Day.create({ date: new Date() }),
      description,
      name,
      userId: new UniqueEntityID(user_id),
      createdAt,
      updatedAt,
    }, new UniqueEntityID(id))
  }

  toPrisma(raw: Goal): PrismaGoal {
    return {
      createdAt: raw.createdAt,
      description: raw.description,
      id: raw.id.toString(),
      name: raw.name,
      updatedAt: raw.updatedAt,
      user_id: raw.userId.toString(),
      day_id : raw.deadline.id.toString()
    }
  }
}