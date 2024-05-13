import { GetByIdHabitUseCase } from "@/domain/habits/application/use-cases/get-by-id-habit"
import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller,HttpCode, Param, UseGuards, Get } from "@nestjs/common"
import { z } from "zod"
import { HabitPresenter } from "../../presenters/habit-presenter"
import { ApiParam, ApiTags } from "@nestjs/swagger"

const paramSchemaValidation = z.object({
  habitId : z.string()
})

type paramType = z.infer<typeof paramSchemaValidation>
@ApiTags('Habit')
@Controller('/habit/:habitId')
export class GetByIdHabitController {
  constructor(private getbyIdHabitUseCase: GetByIdHabitUseCase) { }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiParam({ name : 'habitId'})
  async handle(@Param() { habitId }: paramType, @CurrentUser() { sub }) {
    const habit = await this.getbyIdHabitUseCase.execute({ habitId ,userId : sub })
    return new HabitPresenter().toHttp(habit)
  }
}