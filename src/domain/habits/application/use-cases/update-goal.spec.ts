import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { ResourceNotFound } from "./errors/resource-not-found"
import { GoalRepositoryInMemory } from "test/repositories/in-memory-goal-repository"
import { DayRepositoryInMemory } from "test/repositories/in-memory-day-repository"
import { UpdateGoalUseCase } from "./update-goal"
import { makeGoal } from "test/factories/make-goal"
import { NotAllowed } from "./errors/not-allowed"

describe('Update Goal - Unit', () => {
  let sut: UpdateGoalUseCase
  let inMemoryUserRepository: UserRepositoryInMemory
  let inMemoryGoalRepository: GoalRepositoryInMemory
  let inMemoryDayRepository: DayRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    inMemoryGoalRepository = new GoalRepositoryInMemory()
    sut = new UpdateGoalUseCase(inMemoryGoalRepository, inMemoryUserRepository)
  })

  it('should be to update an goal', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)

    const goal = makeGoal({ userId: user.id })
    inMemoryGoalRepository.create(goal)

    await sut.execute({
      description: 'new-description',
      goalId: goal.id.toString(),
      name: 'new-name',
      userId: user.id.toString(),
      weekday: [{ datetime: new Date(), weekday: 0 }]
    })

    expect(inMemoryGoalRepository.items[0].name).toEqual('new-name')
  })

  it('not should be to update of goal with wrong goal id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const goal = makeGoal({ userId: user.id })
    inMemoryGoalRepository.create(goal)

    expect(async () => {
      await sut.execute({
        description: 'new-description',
        goalId: 'wrong-id',
        name: 'new-name',
        userId: user.id.toString(),
        weekday: [{ datetime: new Date(), weekday: 0 }]
      })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('not should be to update of goal with wrong user id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const goal = makeGoal({ userId: user.id })
    inMemoryGoalRepository.create(goal)

    expect(async () => {
      await sut.execute({
        description: 'new-description',
        goalId: goal.id.toString(),
        name: 'new-name',
        userId: 'wrong-id',
        weekday: [{ datetime: new Date(), weekday: 0 }]
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('not should be to update of goal with not allow goal id and user id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const goal = makeGoal()
    inMemoryGoalRepository.create(goal)

    expect(async () => {
      await sut.execute({
        description: 'new-description',
        goalId: goal.id.toString(),
        name: 'new-name',
        userId: user.id.toString(),
        weekday: [{ datetime: new Date(), weekday: 0 }]
      })
    }).rejects.toBeInstanceOf(NotAllowed)
  })
})