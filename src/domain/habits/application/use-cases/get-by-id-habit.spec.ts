import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { ResourceNotFound } from "./errors/resource-not-found"
import { HabitRepositoryInMemory } from "test/repositories/in-memory-habit-repository"
import { makeHabit } from "test/factories/make-habit"
import { NotAllowed } from "./errors/not-allowed"
import { GetByIdHabitUseCase } from "./get-by-id-habit"

describe('Get by id Habit - Unit', () => {
  let sut: GetByIdHabitUseCase
  let inMemoryUserRepository: UserRepositoryInMemory
  let inMemoryHabitRepository: HabitRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    inMemoryHabitRepository = new HabitRepositoryInMemory()
    sut = new GetByIdHabitUseCase(inMemoryHabitRepository, inMemoryUserRepository)
  })

  it('should be to getby id an habit', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)

    const habit = makeHabit({ userId : user.id})
    inMemoryHabitRepository.create(habit)

    await sut.execute({
      habitId : habit.id.toString(),
      userId : user.id.toString()
    })

    expect(inMemoryHabitRepository.items).toHaveLength(1)
  })

  it('not should be to getbyid of habit with wrong habit id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const habit = makeHabit({ userId : user.id})
    inMemoryHabitRepository.create(habit)

    expect(async () => {
      await sut.execute({
        habitId : 'wrong-id', 
        userId : user.id.toString()
      })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('not should be to getbyid of habit with wrong user id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const habit = makeHabit({ userId : user.id})
    inMemoryHabitRepository.create(habit)
    
    expect(async () => {
      await sut.execute({
        habitId : habit.id.toString(),
        userId : 'wrong-id'
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('not should be to getbyid of habit with not allow habit id and user id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const habit = makeHabit()
    inMemoryHabitRepository.create(habit)
    
    expect(async () => {
      await sut.execute({
        habitId : habit.id.toString(),
        userId : user.id.toString()
      })
    }).rejects.toBeInstanceOf(NotAllowed)
  })
})