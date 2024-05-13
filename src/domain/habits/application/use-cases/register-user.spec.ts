import { InTestEncrypter } from "test/cryptoghphay/in-test-encrypter"
import { InTestHashComparer } from "test/cryptoghphay/in-test-hash-comparer"
import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { RegisterUserUseCase } from "./register-user"
import { makeUser } from "test/factories/make-user"
import { InTextHashGenerator } from "test/cryptoghphay/in-test-hash-generator"
import { InvalidEmail } from "./errors/invalid-email"

describe('Register user use case', () => {
  let sut: RegisterUserUseCase
  let hasherComparer: InTestHashComparer
  let hashGenerator: InTextHashGenerator
  let inMemoryUserRepository: UserRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    hasherComparer = new InTestHashComparer()
    hashGenerator = new InTextHashGenerator()
    sut = new RegisterUserUseCase(inMemoryUserRepository, hashGenerator,)
  })

  it('should be to register of user account', async () => {
    const result = await sut.execute({ 
      email: 'email@mail.com', 
      password: 'password' ,
      name : 'lorem-name'
    })

    expect(result).toBeUndefined()
    expect(inMemoryUserRepository.items).toHaveLength(1)
  })

  it('not should be to register of user account with repeated email', async () => {
    const user = makeUser({ email : 'email-repeated@mail.com' })
    inMemoryUserRepository.create(user)
    expect(async () => {
      await sut.execute({ email : 'email-repeated@mail.com', password: 'password' ,name : 'name'})
    }).rejects.toBeInstanceOf(InvalidEmail)
  })
})