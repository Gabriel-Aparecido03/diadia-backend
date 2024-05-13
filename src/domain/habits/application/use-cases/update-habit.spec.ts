import { InTestEncrypter } from "test/cryptoghphay/in-test-encrypter"
import { InTestHashComparer } from "test/cryptoghphay/in-test-hash-comparer"
import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { ResourceNotFound } from "./errors/resource-not-found"
import { HabitRepositoryInMemory } from "test/repositories/in-memory-habit-repository"
import { DayRepositoryInMemory } from "test/repositories/in-memory-day-repository"
import { UpdateHabitUseCase } from "./update-habit"
import { makeHabit } from "test/factories/make-habit"
import { NotAllowed } from "./errors/not-allowed"

describe('Update Habit - Unit', () => {
  let sut: UpdateHabitUseCase
  let inMemoryUserRepository: UserRepositoryInMemory
  let inMemoryHabitRepository: HabitRepositoryInMemory
  let inMemoryDayRepository: DayRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    inMemoryHabitRepository = new HabitRepositoryInMemory()
    sut = new UpdateHabitUseCase(inMemoryHabitRepository, inMemoryUserRepository)
  })

  it('should be to update an habit', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)

    const habit = makeHabit({ userId: user.id })
    inMemoryHabitRepository.create(habit)

    await sut.execute({
      description: 'new-description',
      habitId: habit.id.toString(),
      name: 'new-name',
      userId: user.id.toString(),
      weekday: [{ datetime: new Date(), weekday: 0 }]
    })

    expect(inMemoryHabitRepository.items[0].name).toEqual('new-name')
  })

  it('not should be to update of habit with wrong habit id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const habit = makeHabit({ userId: user.id })
    inMemoryHabitRepository.create(habit)

    expect(async () => {
      await sut.execute({
        description: 'new-description',
        habitId: 'wrong-id',
        name: 'new-name',
        userId: user.id.toString(),
        weekday: [{ datetime: new Date(), weekday: 0 }]
      })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('not should be to update of habit with wrong user id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const habit = makeHabit({ userId: user.id })
    inMemoryHabitRepository.create(habit)

    expect(async () => {
      await sut.execute({
        description: 'new-description',
        habitId: habit.id.toString(),
        name: 'new-name',
        userId: 'wrong-id',
        weekday: [{ datetime: new Date(), weekday: 0 }]
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('not should be to update of habit with not allow habit id and user id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const habit = makeHabit()
    inMemoryHabitRepository.create(habit)

    expect(async () => {
      await sut.execute({
        description: 'new-description',
        habitId: habit.id.toString(),
        name: 'new-name',
        userId: user.id.toString(),
        weekday: [{ datetime: new Date(), weekday: 0 }]
      })
    }).rejects.toBeInstanceOf(NotAllowed)
  })
})