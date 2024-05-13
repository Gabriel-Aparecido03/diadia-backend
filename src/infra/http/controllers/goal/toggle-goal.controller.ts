import { ToogleGoalUseCase } from "@/domain/habits/application/use-cases/toggle-goal"
import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, HttpCode, Param, UseGuards, Put } from "@nestjs/common"
import { ApiParam, ApiTags } from "@nestjs/swagger"
import { z } from "zod"

const paramSchemaValidation = z.object({
  goalId : z.string()
})

type paramType = z.infer<typeof paramSchemaValidation>
@ApiTags('Goal')
@Controller('/goal/:goalId/toggle')
export class ToggleGoalController {
  constructor(private toogleGoalUseCase: ToogleGoalUseCase) { }

  @Put()
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @ApiParam({name : 'goalId'})
  async handle(@Param() { goalId }: paramType, @CurrentUser() { sub }) {
    await this.toogleGoalUseCase.execute({ goalId ,userId : sub })
  }
}