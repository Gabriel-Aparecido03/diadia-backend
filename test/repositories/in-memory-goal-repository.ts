import { GoalRepository } from "@/domain/habits/application/repositories/goal-repository"
import { Goal } from "@/domain/habits/enterprise/entities/goal"
import { DayRepositoryInMemory } from "./in-memory-day-repository"
import { datesAreOnSameDay } from "@/domain/habits/application/use-cases/utils/is-the-same-day"
import { Day } from "@/domain/habits/enterprise/entities/day"

export class GoalRepositoryInMemory implements GoalRepository {

  constructor(private dayRepositoryInMemory: DayRepositoryInMemory) { }

  public items: Goal[] = []

  async create(goal: Goal): Promise<void> {
    this.items.push(goal)
  }

  async update(goal: Goal): Promise<void> {
    const index = this.items.findIndex(i => i.id.equals(goal.id))
    this.items[index] = goal
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(i => i.id.toString() !== id)
  }

  async getById(id: string): Promise<Goal> {
    const res = this.items.find(i => i.id.toString() === id)
    return res
  }

  async fetchByDate({ date, userId }: { date: Date; userId: string }): Promise<Goal[]> {
    const formatDate = new Date(date.toDateString())
    const res = this.items.filter(i => new Date(i.createdAt.toDateString()) === formatDate)
    return res
  }

  async fetchByDateCompleted({ date, userId }: { date: Date; userId: string }): Promise<Goal[]> {
    const filter = this.dayRepositoryInMemory.items.filter(x => datesAreOnSameDay(date, x.date) && (x.goals.every(y => y.userId.toString() === userId)))
    let goals = []
    filter.map( i => goals.push(i.goals) )
    return goals
  }

  async fetchByMonth({ start, end, userId }: { start: Date; end: Date; userId: string }): Promise<Goal[]> {
    const lastDay = new Date(end.getFullYear(), end.getMonth() + 1, 0);
    const firstDay = new Date(start.getFullYear(), start.getMonth(), 1);

    const res = this.items.filter(i => new Date(i.createdAt.toDateString()) > firstDay && new Date(i.createdAt.toDateString()) < lastDay)
    return res
  }

  async makeGoalDone({ dayId, goalId }: { dayId: string; goalId: string }): Promise<void> {
    let day = await this.dayRepositoryInMemory.getById(dayId)
    if (!day) {
      day = Day.create({ date: new Date() })
      await this.dayRepositoryInMemory.create(day)
    }

    const goal = await this.getById(goalId)
    const array = [...day.goals, goal]
    day.goals = array
    this.dayRepositoryInMemory.update(day)
  }

  async makeGoalNotDone({ dayId, goalId }: { dayId: string; goalId: string }): Promise<void> {
    let day = await this.dayRepositoryInMemory.getById(dayId)
    if (!day) {
      day = Day.create({ date: new Date() })
      await this.dayRepositoryInMemory.create(day)
    }

    const goal = await this.getById(goalId)
    const array = day.goals.filter(x => !goal.id.equals(x.id))
    day.goals = array
    this.dayRepositoryInMemory.update(day)
  }

}