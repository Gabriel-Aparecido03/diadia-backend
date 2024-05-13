import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, HttpCode, Body, UseGuards, Get, Query } from "@nestjs/common"
import { z } from "zod"
import { HabitPresenter } from "../../presenters/habit-presenter"
import { FetchStatsByWeekhHabitsUseCase } from "@/domain/habits/application/use-cases/fetch-stats-by-week"
import { ApiQuery, ApiTags } from "@nestjs/swagger"

const bodySchemaValidation = z.object({
  date: z.coerce.date()
})

type bodyType = z.infer<typeof bodySchemaValidation>
@ApiTags('Habit')
@Controller('/habits/stats/week')
export class FetchStatsByWeekHabitsController {
  constructor(private fetchStatsByWeekHabitsUseCase: FetchStatsByWeekhHabitsUseCase) { }
  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiQuery({ name : 'date'})
  async handle(@Query() { date }: bodyType, @CurrentUser() { sub }) {

    const habits = await this.fetchStatsByWeekHabitsUseCase.execute({ date: new Date(date), userId: sub })
    return habits.map(i => {
      return {
        completedHabits: i.completedHabits.map(i => new HabitPresenter().toHttp(i)),
        possibleHabits: i.possibleHabits.map(i => new HabitPresenter().toHttp(i)),
        date : i.date
      }
    })
  }
}