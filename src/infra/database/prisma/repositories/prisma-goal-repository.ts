import { GoalRepository } from "@/domain/habits/application/repositories/goal-repository";
import { Goal } from "@/domain/habits/enterprise/entities/goal";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaGoalMapper } from "../mapper/prisma-goal-mapper";

@Injectable()
export class PrismaGoalRepository implements GoalRepository {

  constructor(private prismaService: PrismaService) { }

  async create(goal: Goal): Promise<void> {
    const data = new PrismaGoalMapper().toPrisma(goal)
    await this.prismaService.goal.create({ data })
  }

  async update(goal: Goal): Promise<void> {
    const data = new PrismaGoalMapper().toPrisma(goal)
    await this.prismaService.goal.update({ where: { id: data.id }, data : {
      name : data.name,
      description : data.description
    } })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.goal.delete({ where: { id } })
  }

  async getById(id: string): Promise<Goal> {
    const res = await this.prismaService.goal.findUnique({ where: { id } })
    if (!res) return null
    return new PrismaGoalMapper().toDomain(res)
  }

  async fetchByDate({ date, userId }: { date: Date; userId: string; }): Promise<Goal[]> {
    const res = await this.prismaService.goal.findMany({
      where: {
        user_id: userId,
        day: {
          date: {
            gte: date
          }
        }
      }
    })

    if (!res) return null
    return res.map(i => new PrismaGoalMapper().toDomain(i))
  }

  async fetchByDateCompleted({ date, userId }: { date: Date; userId: string; }): Promise<Goal[]> {
    const goals = await this.prismaService.goalDay.findMany({
      select: {
        goal: true,
        day: true
      },
      where: {
        goal: {
          user_id: userId,
        },
        day : {
          date : new Date(date)
        }
      }
    })
    if (!goals) return null
    return goals.map(i => new PrismaGoalMapper().toDomain(i.goal))
  }

  async fetchByMonth({ start, end, userId }: { start: Date; end: Date; userId: string; }): Promise<Goal[]> {
    const res = await this.prismaService.goal.findMany({
      where: {
        user_id: userId,
        day: {
          date: {
            gte: start,
            lte: end
          }
        }
      }
    })

    if (!res) return null
    return res.map(i => new PrismaGoalMapper().toDomain(i))
  }

  async makeGoalDone({ dayId, goalId }: { dayId: string; goalId: string; }): Promise<void> {
    await this.prismaService.goalDay.create({
      data: {
        day_id: dayId,
        goal_id: goalId
      }
    })
  }

  async makeGoalNotDone({ dayId, goalId }: { dayId: string; goalId: string; }): Promise<void> {
    await this.prismaService.goalDay.deleteMany({
      where: {
        day_id: dayId,
        goal_id: goalId
      }
    })
  }

}