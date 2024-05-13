import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encrypter";
import { HashComparer } from "../cryptography/hash-comparer";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";

interface AuthenticateUserUseCasePropsType {
  email: string
  password: string
}

@Injectable()
export class AuthenticateUserUseCase {

  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) { }

  async execute({ email, password }: AuthenticateUserUseCasePropsType) {
    const user = await this.userRepository.getEmail(email)
    if (!user) throw new InvalidCredentials()

    const isPasswordMatch = await this.hashComparer.comparer(password, user.password)
    if (!isPasswordMatch) throw new InvalidCredentials()
    
    const accessToken = await this.encrypter.encrypt({ sub: user.id.toString() })

    return { access_token: accessToken }
  }
}