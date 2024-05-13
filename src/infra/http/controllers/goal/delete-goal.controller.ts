import { DeleteGoalUseCase } from "@/domain/habits/application/use-cases/delete-goal"
import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, Post, HttpCode, Param, UseGuards, Delete } from "@nestjs/common"
import { ApiParam, ApiTags } from "@nestjs/swagger"
import { z } from "zod"

const paramSchemaValidation = z.object({
  goalId : z.string()
})

type paramType = z.infer<typeof paramSchemaValidation>
@ApiTags('Goal')
@Controller('/goal/:goalId')
export class DeleteGoalController {
  constructor(private deleteGoalUseCase: DeleteGoalUseCase) { }

  @Delete()
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @ApiParam({ name : 'goalId'})
  async handle(@Param() { goalId }: paramType, @CurrentUser() { sub }) {
    await this.deleteGoalUseCase.execute({ goalId ,userId : sub })
  }
}