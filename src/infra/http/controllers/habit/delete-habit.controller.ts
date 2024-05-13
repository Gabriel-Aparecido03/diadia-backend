import { DeleteHabitUseCase } from "@/domain/habits/application/use-cases/delete-habit"
import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, Post, HttpCode, Param, UseGuards, Delete } from "@nestjs/common"
import { ApiParam, ApiTags } from "@nestjs/swagger"
import { z } from "zod"

const paramSchemaValidation = z.object({
  habitId : z.string()
})

type paramType = z.infer<typeof paramSchemaValidation>
@ApiTags('Habit')
@Controller('/habit/:habitId')
export class DeleteHabitController {
  constructor(private deleteHabitUseCase: DeleteHabitUseCase) { }

  @Delete()
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @ApiParam({ name : 'habitId'})
  async handle(@Param() { habitId }: paramType, @CurrentUser() { sub }) {
    await this.deleteHabitUseCase.execute({ habitId ,userId : sub })
  }
}