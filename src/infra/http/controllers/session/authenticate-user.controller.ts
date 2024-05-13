import { AuthenticateUserUseCase } from "@/domain/habits/application/use-cases/authenticate-user"
import { Controller, Post, HttpCode, Body } from "@nestjs/common"
import { ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger"
import { z } from "zod"

const bodySchemaValidation = z.object({
  email : z.string(),
  password : z.string()
})

type bodyType = z.infer<typeof bodySchemaValidation>

class UserAuthenticatedDTO implements bodyType{
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

@ApiTags('Session')
@Controller('/session/authenticate')
export class AuthenticateUserController {
  constructor(private authenticateUserUseCase : AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(200)
  @ApiBody({ type : UserAuthenticatedDTO})
  async handle(@Body() requestBody : bodyType) {
    const { email ,password } = bodySchemaValidation.parse(requestBody)
    const result = await this.authenticateUserUseCase.execute({ email , password  })
    return result
  }
}