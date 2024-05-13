import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, HttpCode, Query, UseGuards, Get } from "@nestjs/common"
import { z } from "zod"
import { GoalPresenter } from "../../presenters/goal-presenter"
import { FetchByDateGoalUseCase } from "@/domain/habits/application/use-cases/fetch-by-date-goal"
import { ApiQuery, ApiTags } from "@nestjs/swagger"

const querySchemaValidation = z.object({
  date : z.coerce.date()
})

type queryType = z.infer<typeof querySchemaValidation>
@ApiTags('Goal')
@Controller('/goals/by-date')
export class FetchGoalByDateController {
  constructor(private fetchByDateGoalUseCase: FetchByDateGoalUseCase) { }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiQuery({ name : 'date'})
  async handle(@Query() { date }: queryType, @CurrentUser() { sub }) {
    
    const { completedGoals ,possibleGoals } = await this.fetchByDateGoalUseCase.execute({ date : new Date(date) ,userId : sub })
    return {
      completedGoals : completedGoals.map( i => new GoalPresenter().toHttp(i)),
      possibleGoals : possibleGoals.map( i => new GoalPresenter().toHttp(i))
    }
  }
}