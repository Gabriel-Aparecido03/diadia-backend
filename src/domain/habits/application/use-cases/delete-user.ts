import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user-repository";
import { ResourceNotFound } from "./errors/resource-not-found";

interface DeleteUserUseCasePropsType {
  id : string
}

@Injectable()
export class DeleteUserUseCase {

  constructor(private userRepository: UserRepository) { }

  async execute({ id }: DeleteUserUseCasePropsType) {
    const user = await this.userRepository.getById(id)
    if(!user) throw new ResourceNotFound()
    await this.userRepository.delete(id)
  }
}