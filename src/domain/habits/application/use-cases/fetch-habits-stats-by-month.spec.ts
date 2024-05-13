import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { HabitRepositoryInMemory } from "test/repositories/in-memory-habit-repository"
import { DayRepositoryInMemory } from "test/repositories/in-memory-day-repository"
import { makeHabit } from "test/factories/make-habit"
import { FetchStatsByMonthHabitsUseCase } from "./fetch-habits-stats-by-month"

describe('Fetch by date habit - Unit', () => {
  let sut: FetchStatsByMonthHabitsUseCase
  let inMemoryUserRepository: UserRepositoryInMemory
  let inMemoryHabitRepository: HabitRepositoryInMemory
  let inMemoryDayRepository: DayRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    inMemoryDayRepository = new DayRepositoryInMemory()
    inMemoryHabitRepository = new HabitRepositoryInMemory(inMemoryDayRepository)
    sut = new FetchStatsByMonthHabitsUseCase(inMemoryHabitRepository, inMemoryUserRepository)
  })

  it('should be fetch date habit by month', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)

    const habit = makeHabit({ userId: user.id })
    inMemoryHabitRepository.create(habit)

    const res = await sut.execute({
      userId: user.id.toString(),
      date : new Date()
    })

    expect(res).toHaveLength(30 || 31 || 28 || 29)
  })
})