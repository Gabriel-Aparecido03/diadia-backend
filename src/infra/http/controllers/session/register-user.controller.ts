import { RegisterUserUseCase } from "@/domain/habits/application/use-cases/register-user"
import { Controller, Post, HttpCode, Body } from "@nestjs/common"
import { ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger"
import { z } from "zod"

const bodySchemaValidation = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string()
})

type bodyType = z.infer<typeof bodySchemaValidation>

class UserCreatedDTO implements bodyType {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  name: string;
}

@ApiTags('Session')
@Controller('/user')
export class RegisterUserController {
  constructor(private registerUserUseCase: RegisterUserUseCase) { }

  @Post()
  @HttpCode(200)
  @ApiBody({ type : UserCreatedDTO})
  async handle(@Body() requestBody: bodyType) {
    const { email, password, name } = bodySchemaValidation.parse(requestBody)
    await this.registerUserUseCase.execute({ email, password ,name})
  }
}