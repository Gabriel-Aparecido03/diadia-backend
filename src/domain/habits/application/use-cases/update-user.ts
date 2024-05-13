import { Injectable } from "@nestjs/common";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserRepository } from "../repositories/user-repository";
import { ResourceNotFound } from "./errors/resource-not-found";
import { ApiTags } from "@nestjs/swagger";

interface UpdateUserUseCasePropsType {
  password: string
  name: string
  id: string
  email: string
}

@Injectable()
export class UpdateUserUseCase {

  constructor(private userRepository: UserRepository, private hashGenerator: HashGenerator) { }

  async execute({ name, password, id, email }: UpdateUserUseCasePropsType) {
    const user = await this.userRepository.getById(id)
    if (!user) throw new ResourceNotFound()

    user.password = await this.hashGenerator.encrypt(password)
    user.name = name
    user.email = email

    await this.userRepository.update(user)
  }
}