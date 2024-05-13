import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { GoalRepositoryInMemory } from "test/repositories/in-memory-goal-repository"
import { CreateGoalUseCase } from "./create-goal"
import { DayRepositoryInMemory } from "test/repositories/in-memory-day-repository"

describe('Create goal - Unit', () => {
  let sut: CreateGoalUseCase
  let inMemoryUserRepository: UserRepositoryInMemory
  let inMemoryGoalRepository: GoalRepositoryInMemory
  let inMemoryDayRepository: DayRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    inMemoryGoalRepository = new GoalRepositoryInMemory()
    inMemoryDayRepository = new DayRepositoryInMemory()
    sut = new CreateGoalUseCase(inMemoryGoalRepository, inMemoryUserRepository, inMemoryDayRepository)
  })

  it('should be to create an goal', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)

    await sut.execute({
      day: new Date(),
      description: 'lorem-description',
      name: 'lorem-descrption',
      userId: user.id.toString(),
      deadline: new Date()
    })

    expect(inMemoryGoalRepository.items).toHaveLength(1)
  })

  it('not should be to authtenticate of user account with wrong email', async () => {
    const user = makeUser()
    inMemoryUserRepository.create(user)
    expect(async () => {
      await sut.execute({
        day: new Date(),
        description: 'lorem-description',
        name: 'lorem-descrption',
        userId: 'wrong-id',
        deadline: new Date()
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })
})