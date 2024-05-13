import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { HabitRepositoryInMemory } from "test/repositories/in-memory-habit-repository"
import { CreateHabitUseCase } from "./create-habit"
import { DayRepositoryInMemory } from "test/repositories/in-memory-day-repository"

describe('Create Habit - Unit', () => {
  let sut: CreateHabitUseCase
  let inMemoryUserRepository: UserRepositoryInMemory
  let inMemoryHabitRepository: HabitRepositoryInMemory
  let inMemoryDayRepository: DayRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    inMemoryHabitRepository = new HabitRepositoryInMemory()
    inMemoryDayRepository = new DayRepositoryInMemory()
    sut = new CreateHabitUseCase(inMemoryHabitRepository, inMemoryUserRepository, inMemoryDayRepository)
  })

  it('should be to create an habit', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)

    await sut.execute({
      day: new Date(),
      description: 'lorem-description',
      name: 'lorem-descrption',
      userId: user.id.toString(),
      weekday: [{ datetime: new Date(), weekday: 0 }]
    })

    expect(inMemoryHabitRepository.items).toHaveLength(1)
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
        weekday: [{ datetime: new Date(), weekday: 0 }]
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })
})