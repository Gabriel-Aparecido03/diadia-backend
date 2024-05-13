import { InTestEncrypter } from "test/cryptoghphay/in-test-encrypter"
import { InTestHashComparer } from "test/cryptoghphay/in-test-hash-comparer"
import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { DeleteUserUseCase } from "./delete-user"
import { makeUser } from "test/factories/make-user"
import { ResourceNotFound } from "./errors/resource-not-found"

describe('Delete user - Unit', () => {
  let sut: DeleteUserUseCase
  let inMemoryUserRepository: UserRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    sut = new DeleteUserUseCase(inMemoryUserRepository)
  })

  it('should be to delete an user', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)
    const result = await sut.execute({ id: user.id.toString() })

    expect(result).toBeUndefined()
    expect(inMemoryUserRepository.items).toHaveLength(0)
  })

  it('not should be to delete an user with non exist id', async () => {
    const user = makeUser()
    inMemoryUserRepository.create(user)
    expect(async () => {
      await sut.execute({ id: 'wrong-id' })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })
})