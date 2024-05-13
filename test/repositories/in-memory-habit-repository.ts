import { HabitRepository } from "@/domain/habits/application/repositories/habit-repository";
import { datesAreOnSameDay } from "@/domain/habits/application/use-cases/utils/is-the-same-day";
import { Habit } from "@/domain/habits/enterprise/entities/habit";
import { DayRepositoryInMemory } from "./in-memory-day-repository";
import { Day } from "@/domain/habits/enterprise/entities/day";

export class HabitRepositoryInMemory implements HabitRepository {

  constructor(private dayRepositoryInMemory: DayRepositoryInMemory) { }

  async makeHabitDone({ dayId, habitId }: { dayId: string; habitId: string; }): Promise<void> {
    let day = await this.dayRepositoryInMemory.getById(dayId)
    if (!day) {
      day = Day.create({ date: new Date() })
      await this.dayRepositoryInMemory.create(day)
    }

    const habit = await this.getById(habitId)
    const array = [...day.habits, habit]
    day.habits = array
    this.dayRepositoryInMemory.update(day)
  }

  async makeHabitNotDone({ dayId, habitId }: { dayId: string; habitId: string; }): Promise<void> {
    let day = await this.dayRepositoryInMemory.getById(dayId)
    if (!day) {
      day = Day.create({ date: new Date() })
      await this.dayRepositoryInMemory.create(day)
    }

    const habit = await this.getById(habitId)
    const array = day.habits.filter(x => !habit.id.equals(x.id))
    day.habits = array
    this.dayRepositoryInMemory.update(day)
  }

  public items: Habit[] = []

  async create(habit: Habit): Promise<void> {
    this.items.push(habit)
  }

  async update(habit: Habit): Promise<void> {
    const index = this.items.findIndex(i => i.id.equals(habit.id))
    this.items[index] = habit
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(i => i.id.toString() !== id)
  }

  async getById(id: string): Promise<Habit> {
    const res = this.items.find(i => i.id.toString() === id)
    return res
  }

  async fetchByDate({ date, userId }: { date: Date, userId: string }): Promise<Habit[]> {
    const res = this.items.filter(i => datesAreOnSameDay(i.createdAt, date) && userId === i.userId.toString())
    return res
  }

  async fetchStatsByMonth({ start, end, userId }: { start: Date; end: Date; userId: string; }): Promise<Habit[]> {
    const res = this.items.filter(i => i.createdAt >= start && i.createdAt <= end && i.userId.toString() === userId)
    return res
  }

  async fetchByDateCompleted({ date, userId }: { date: Date; userId: string; }): Promise<Habit[]> {
    const filter = this.dayRepositoryInMemory.items.filter(x => datesAreOnSameDay(date, x.date) && (x.habits.every(y => y.userId.toString() === userId)))
    let habits = []
    filter.map( i => habits.push(i.habits) )
    return habits
  }

}