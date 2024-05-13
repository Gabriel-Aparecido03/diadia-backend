import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserRepository } from "../repositories/user-repository";
import { InvalidEmail } from "./errors/invalid-email";

interface RegisterUserUseCasePropsType {
  password: string
  email: string
  name: string
}

@Injectable()
export class RegisterUserUseCase {

  constructor(private userRepository: UserRepository, private hashGenerator: HashGenerator) { }

  async execute({ email, name, password }: RegisterUserUseCasePropsType) {

    const isRepeatedEmail = await this.userRepository.getEmail(email)
    if (isRepeatedEmail) throw new InvalidEmail()

    const user = User.create({ email, name, password: await this.hashGenerator.encrypt(password) })
    
    await this.userRepository.create(user)
  }
}