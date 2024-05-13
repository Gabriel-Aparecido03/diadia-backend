import { DeleteUserUseCase } from "@/domain/habits/application/use-cases/delete-user"
import { AuthGuard } from "@/infra/auth/auth.guard"
import { CurrentUser } from "@/infra/auth/current-user"
import { Controller, HttpCode, UseGuards, Delete } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
@ApiTags('Session')
@Controller('/user')
export class DeleteUserController {
  constructor(private deleteUserUseCase : DeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async handle(@CurrentUser() { sub }) {
    await this.deleteUserUseCase.execute({ id : sub  })
  }
}