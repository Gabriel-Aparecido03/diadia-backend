import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { ResourceNotFound } from "./errors/resource-not-found"
import { GoalRepositoryInMemory } from "test/repositories/in-memory-goal-repository"
import { DeleteGoalUseCase } from "./delete-goal"
import { makeGoal } from "test/factories/make-goal"
import { NotAllowed } from "./errors/not-allowed"
import { DayRepository } from "../repositories/day-repository"
import { DayRepositoryInMemory } from "test/repositories/in-memory-day-repository"

describe('Delete goal - Unit', () => {
  let sut: DeleteGoalUseCase
  let inMemoryUserRepository: UserRepositoryInMemory
  let inMemoryGoalRepository: GoalRepositoryInMemory
  let inMemoryDayRepository : DayRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    inMemoryDayRepository = new DayRepositoryInMemory()
    inMemoryGoalRepository = new GoalRepositoryInMemory(inMemoryDayRepository)
    sut = new DeleteGoalUseCase(inMemoryGoalRepository, inMemoryUserRepository)
  }) 

  it('should be to delete an goal', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)

    const goal = makeGoal({ userId : user.id})
    inMemoryGoalRepository.create(goal)

    await sut.execute({
      goalId : goal.id.toString(),
      userId : user.id.toString()
    })

    expect(inMemoryGoalRepository.items).toHaveLength(0)
  })

  it('not should be to delete of goal with wrong goal id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const goal = makeGoal({ userId : user.id})
    inMemoryGoalRepository.create(goal)

    expect(async () => {
      await sut.execute({
        goalId : 'wrong-id', 
        userId : user.id.toString()
      })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('not should be to delete of goal with wrong user id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const goal = makeGoal({ userId : user.id})
    inMemoryGoalRepository.create(goal)
    
    expect(async () => {
      await sut.execute({
        goalId : goal.id.toString(),
        userId : 'wrong-id'
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('not should be to delete of goal with not allow goal id and user id', async () => {

    const user = makeUser()
    inMemoryUserRepository.create(user)

    const goal = makeGoal()
    inMemoryGoalRepository.create(goal)
    
    expect(async () => {
      await sut.execute({
        goalId : goal.id.toString(),
        userId : user.id.toString()
      })
    }).rejects.toBeInstanceOf(NotAllowed)
  })
})