import { InTestEncrypter } from "test/cryptoghphay/in-test-encrypter"
import { InTestHashComparer } from "test/cryptoghphay/in-test-hash-comparer"
import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { UpdateUserUseCase } from "./update-user"
import { makeUser } from "test/factories/make-user"
import { InTextHashGenerator } from "test/cryptoghphay/in-test-hash-generator"
import { InvalidEmail } from "./errors/invalid-email"
import { ResourceNotFound } from "./errors/resource-not-found"

describe('Update user use case', () => {
  let sut: UpdateUserUseCase
  let hasherComparer: InTestHashComparer
  let hashGenerator: InTextHashGenerator
  let inMemoryUserRepository: UserRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    hasherComparer = new InTestHashComparer()
    hashGenerator = new InTextHashGenerator()
    sut = new UpdateUserUseCase(inMemoryUserRepository,hashGenerator)
  })

  it('should be to update of user account', async () => {
    const user = makeUser({
      email: 'email@mail.com'
    })
    inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: 'email-new@mail.com',
      password: 'password-new',
      name: 'lorem-name',
      id: user.id.toString()
    })

    expect(result).toBeUndefined()
    expect(inMemoryUserRepository.items[0].name).toEqual('lorem-name')
    expect(inMemoryUserRepository.items[0].email).toEqual('email-new@mail.com')
  })

  it('not should be to update of user account with non exists id', async () => {
    const user = makeUser({ email: 'email-repeated@mail.com' })
    inMemoryUserRepository.create(user)
    expect(async () => {
      await sut.execute({ email: 'email-repeated@mail.com', password: 'password', name: 'name' , id : 'wrong-id'})
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })
})