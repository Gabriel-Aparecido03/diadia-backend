import { CreateGoalUseCase } from "@/domain/habits/application/use-cases/create-goal"
import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, Post, HttpCode, Body, UseGuards } from "@nestjs/common"
import { ApiBasicAuth, ApiBody, ApiParam, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger"
import { T } from "vitest/dist/reporters-P7C2ytIv"
import { z, ZodObject } from "zod"

const bodySchemaValidation = z.object({
  day: z.coerce.date().nullable(),
  description: z.string(),
  name: z.string(),
})

type bodyType = z.infer<typeof bodySchemaValidation>

class CreateGoalDto {
  @ApiProperty()
  day : Date

  @ApiProperty()
  description : String

  @ApiProperty()
  name : String
}

@ApiTags('Goal')
@Controller('/goal')
export class CreateGoalController {
  constructor(private createGoalUseCase: CreateGoalUseCase) { }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateGoalDto,
  })
  async handle(@Body() { day, description, name }: bodyType, @CurrentUser() { sub }) {
    await this.createGoalUseCase.execute({ description, name, userId: sub, day })
  }
}