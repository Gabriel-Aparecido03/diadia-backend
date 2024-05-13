import { UpdateHabitUseCase } from "@/domain/habits/application/use-cases/update-habit"
import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, Post, HttpCode, Body, UseGuards, Param, Put } from "@nestjs/common"
import { ApiBody, ApiParam, ApiProperty, ApiTags } from "@nestjs/swagger"
import { z } from "zod"

const bodySchemaValidation = z.object({
  description: z.string(),
  name: z.string(),
  weekday: z.array(z.object({
    timeInSeconds: z.coerce.number(),
    weekday: z.coerce.number().min(0).max(6)
  }))
})

const paramSchemaValidation = z.object({
  habitId : z.string()
})

type bodyType = z.infer<typeof bodySchemaValidation>

class UpdatedHabitDto implements bodyType {
  @ApiProperty()
  description: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  weekday: {
    timeInSeconds: number;
    weekday: number;
  }[];
}

type paramType = z.infer<typeof paramSchemaValidation>
@ApiTags('Habit')
@Controller('/habit/:habitId')
export class UpdateHabitController {
  constructor(private updateHabitUseCase: UpdateHabitUseCase) { }

  @Put()
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @ApiParam({ name : 'habitId'})
  @ApiBody({ type : UpdatedHabitDto })
  async handle(@Body() { description, name, weekday }: bodyType, @CurrentUser() { sub },@Param() { habitId }: paramType) {
    await this.updateHabitUseCase.execute({ description, name, userId: sub, habitId , weekday })
  }
}