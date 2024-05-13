import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user-repository";

interface GetByIdUserUseCasePropsType {
  id : string
}

@Injectable()
export class GetByIdUserUseCase {

  constructor(private userRepository: UserRepository) { }

  async execute({ id }: GetByIdUserUseCasePropsType) {
    const user = await this.userRepository.getById(id)
    return user
  }
}