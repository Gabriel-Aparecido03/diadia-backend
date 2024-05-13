import { UniqueEntityID } from "@/domain/core/unique-entity-id";
import { Day } from "../../enterprise/entities/day";
import { Habit } from "../../enterprise/entities/habit";
import { Weekday } from "../../enterprise/entities/weekday";
import { WeekdayList } from "../../enterprise/entities/weekday-list";
import { DayRepository } from "../repositories/day-repository";
import { HabitRepository } from "../repositories/habit-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { Injectable } from "@nestjs/common";

interface CreateHabitUseCasePropsType {
  userId: string
  name: string
  description: string
  day: Date
  weekday: {
    weekday?: number
    timeInSeconds?: number
  }[]
}

@Injectable()
export class CreateHabitUseCase {

  constructor(
    private habitRepository: HabitRepository,
    private userRepository: UserRepository,
    private dayRepository: DayRepository
  ) { }

  async execute({ day, description, name, userId, weekday }: CreateHabitUseCasePropsType) {
    const userExists = await this.userRepository.getById(userId)
    if (!userExists) throw new InvalidCredentials()
    let dayAtDatabase = await this.dayRepository.getByDate(day)

    if (!dayAtDatabase) {
      const auxDay = Day.create({ date: day, habits: [] })
      await this.dayRepository.create(auxDay)
      dayAtDatabase = auxDay
    }
    const habit = Habit.create({ description, name, userId: new UniqueEntityID(userId), createdAt: day })
    const weekdays = weekday.map(i => Weekday.create({ timeInSeconds: i.timeInSeconds, habitId: habit.id, weekday: i.weekday }))

    habit.weekdays = new WeekdayList(weekdays)

    let habitsArray = dayAtDatabase.habits
    habitsArray.push(habit)

    dayAtDatabase.habits = habitsArray

    await this.dayRepository.update(dayAtDatabase)
    await this.habitRepository.create(habit)
  }
}