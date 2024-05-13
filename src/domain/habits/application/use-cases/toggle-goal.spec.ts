import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { GoalRepositoryInMemory } from "test/repositories/in-memory-goal-repository"
import { DayRepositoryInMemory } from "test/repositories/in-memory-day-repository"
import { makeGoal } from "test/factories/make-goal"
import { ToogleGoalUseCase } from "./toggle-goal"
import { makeDay } from "test/factories/make-day"
import { startOfTheDay } from "./utils/start-of-the-day"
import { Day } from "../../enterprise/entities/day"

describe('Delete Goal - Unit', () => {
  let sut: ToogleGoalUseCase
  let inMemoryUserRepository: UserRepositoryInMemory
  let inMemoryGoalRepository: GoalRepositoryInMemory
  let inMemoryDayRepository: DayRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    inMemoryDayRepository = new DayRepositoryInMemory()
    inMemoryGoalRepository = new GoalRepositoryInMemory(inMemoryDayRepository)
    sut = new ToogleGoalUseCase(inMemoryGoalRepository, inMemoryUserRepository, inMemoryDayRepository)
  })

  it('should be make goal as done', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)

    const goal = makeGoal({ userId: user.id })
    inMemoryGoalRepository.create(goal)

    await sut.execute({
      goalId: goal.id.toString(),
      userId: user.id.toString()
    })

    expect(inMemoryDayRepository.items[0].goals).toHaveLength(1)
  })

  it('should be make goal as not done', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)

    const goal = makeGoal({ userId: user.id , deadline : Day.create({date : startOfTheDay(new Date())}),})
    inMemoryGoalRepository.create(goal)

    const day = makeDay({ date: startOfTheDay(new Date()), goals: [goal] })
    inMemoryDayRepository.create(day)

    await sut.execute({
      goalId: goal.id.toString(),
      userId: user.id.toString()
    })

    expect(inMemoryDayRepository.items[0].goals).toHaveLength(0)
  })
})