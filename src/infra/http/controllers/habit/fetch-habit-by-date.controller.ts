import { FetchByDateHabitUseCase } from "@/domain/habits/application/use-cases/fetch-by-date-habit"
import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, HttpCode, Query, UseGuards, Get } from "@nestjs/common"
import { z } from "zod"
import { HabitPresenter } from "../../presenters/habit-presenter"
import { ApiQuery, ApiTags } from "@nestjs/swagger"

const querySchemaValidation = z.object({
  date : z.coerce.date()
})

type queryType = z.infer<typeof querySchemaValidation>
@ApiTags('Habit')
@Controller('/habits/by-date')
export class FetchHabitByDateController {
  constructor(private fetchByDateHabitUseCase: FetchByDateHabitUseCase) { }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiQuery({ name : 'date'})
  async handle(@Query() { date }: queryType, @CurrentUser() { sub }) {
    
    const { completedHabits ,possibleHabits } = await this.fetchByDateHabitUseCase.execute({ date : new Date(date) ,userId : sub })
    return {
      completedHabits : completedHabits.map( i => new HabitPresenter().toHttp(i)),
      possibleHabits : possibleHabits.map( i => new HabitPresenter().toHttp(i))
    }
  }
}