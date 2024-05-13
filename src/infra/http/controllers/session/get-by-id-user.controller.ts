import { GetByIdUserUseCase } from "@/domain/habits/application/use-cases/get-by-id-user"
import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, HttpCode, UseGuards, Get } from "@nestjs/common"
import { UserPresenter } from "../../presenters/user-presenter"
import { ApiTags } from "@nestjs/swagger"
@ApiTags('Session')
@Controller('/session/me')
export class GetByIdUserController {
  constructor(private getByIdUserUseCase : GetByIdUserUseCase) {}

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async handle(@CurrentUser() { sub }) {
    const user = await this.getByIdUserUseCase.execute({ id : sub  })
    return new UserPresenter().toHttp(user)
  }
}