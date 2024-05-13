import { Goal } from "../../enterprise/entities/goal";

export abstract class GoalRepository {
  abstract create(goal: Goal): Promise<void>
  abstract update(goal: Goal): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract getById(id: string): Promise<Goal>
  abstract fetchByDate({ date, userId }: { date: Date, userId: string }): Promise<Goal[]>
  abstract fetchByDateCompleted({ date, userId }: { date: Date, userId: string }): Promise<Goal[]>
  abstract fetchByMonth({ start, end, userId }: { start: Date, end: Date, userId: string }) : Promise<Goal[]>
  abstract makeGoalDone({ dayId, goalId }: { dayId: string, goalId: string }) : Promise<void>
  abstract makeGoalNotDone({ dayId, goalId }: { dayId: string, goalId: string }) : Promise<void>
}