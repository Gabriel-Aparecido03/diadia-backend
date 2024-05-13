import { Injectable } from "@nestjs/common";
import { Day } from "../../enterprise/entities/day";
import { Habit } from "../../enterprise/entities/habit";
import { Weekday } from "../../enterprise/entities/weekday";
import { WeekdayList } from "../../enterprise/entities/weekday-list";
import { DayRepository } from "../repositories/day-repository";
import { HabitRepository } from "../repositories/habit-repository";
import { UserRepository } from "../repositories/user-repository";
import { WeekdayParamType } from "../types/weekday-param";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { NotAllowed } from "./errors/not-allowed";
import { ResourceNotFound } from "./errors/resource-not-found";

interface UpdateHabitUseCasePropsType {
  userId: string
  habitId: string
  name: string
  description: string
  weekday: WeekdayParamType[]
}

@Injectable()
export class UpdateHabitUseCase {

  constructor(
    private habitRepository: HabitRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, habitId, description, name, weekday }: UpdateHabitUseCasePropsType) {

    const user = await this.userRepository.getById(userId)
    if (!user) throw new InvalidCredentials()

    const habit = await this.habitRepository.getById(habitId)
    if (!habit) throw new ResourceNotFound()

    if (!user.id.equals(habit.userId)) throw new NotAllowed()

    const weekdays = weekday.map(i => Weekday.create({ timeInSeconds: i.timeInSeconds, habitId: habit.id, weekday: i.weekday, }))
    habit.description = description
    habit.name = name
    habit.weekdays.update(weekdays)
    await this.habitRepository.update(habit)
  }
}