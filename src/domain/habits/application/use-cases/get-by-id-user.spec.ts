import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { ResourceNotFound } from "./errors/resource-not-found"
import { GetByIdUserUseCase } from "./get-by-id-user"

describe('Get by id user- Unit', () => {
  let sut: GetByIdUserUseCase
  let inMemoryUserRepository: UserRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    sut = new GetByIdUserUseCase(inMemoryUserRepository)
  })

  it('should be to get user by id', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)
    const result = await sut.execute({ id: user.id.toString() })

    expect(result).toEqual(expect.objectContaining({
      name : user.name,
      id : user.id,
      email : user.email
    }))
  })
})