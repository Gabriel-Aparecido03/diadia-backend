import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateUserUseCase } from '@/domain/habits/application/use-cases/authenticate-user';
import { AuthenticateUserController } from './controllers/session/authenticate-user.controller';
import { RegisterUserUseCase } from '@/domain/habits/application/use-cases/register-user';
import { RegisterUserController } from './controllers/session/register-user.controller';
import { FetchStatsByMonthHabitsUseCase } from '@/domain/habits/application/use-cases/fetch-habits-stats-by-month';
import { FetchStatsByMonthHabitsController } from './controllers/habit/fetch-stats-by-month-habits.controller';
import { GetByIdUserController } from './controllers/session/get-by-id-user.controller';
import { GetByIdUserUseCase } from '@/domain/habits/application/use-cases/get-by-id-user';
import { UpdateUserController } from './controllers/session/update-user.controller';
import { UpdateUserUseCase } from '@/domain/habits/application/use-cases/update-user';
import { DeleteUserUseCase } from '@/domain/habits/application/use-cases/delete-user';
import { DeleteUserController } from './controllers/session/delete-user.controller';
import { CreateHabitController } from './controllers/habit/create-habit.controller';
import { CreateHabitUseCase } from '@/domain/habits/application/use-cases/create-habit';
import { DeleteHabitUseCase } from '@/domain/habits/application/use-cases/delete-habit';
import { DeleteHabitController } from './controllers/habit/delete-habit.controller';
import { FetchByDateHabitUseCase } from '@/domain/habits/application/use-cases/fetch-by-date-habit';
import { FetchHabitByDateController } from './controllers/habit/fetch-habit-by-date.controller';
import { GetByIdHabitController } from './controllers/habit/get-by-id-habit.controller';
import { GetByIdHabitUseCase } from '@/domain/habits/application/use-cases/get-by-id-habit';
import { ToogleHabitUseCase } from '@/domain/habits/application/use-cases/toggle-habit';
import { ToggleHabitController } from './controllers/habit/toggle-habit.controller';
import { UpdateHabitController } from './controllers/habit/update-habit.controller';
import { UpdateHabitUseCase } from '@/domain/habits/application/use-cases/update-habit';
import { CreateGoalController } from './controllers/goal/create-goal.controller';
import { CreateGoalUseCase } from '@/domain/habits/application/use-cases/create-goal';
import { DeleteGoalController } from './controllers/goal/delete-goal.controller';
import { DeleteGoalUseCase } from '@/domain/habits/application/use-cases/delete-goal';
import { UpdateGoalController } from './controllers/goal/update-goal.controller';
import { UpdateGoalUseCase } from '@/domain/habits/application/use-cases/update-goal';
import { FetchGoalByDateController } from './controllers/goal/fetch-by-date-goal.controller';
import { FetchByDateGoalUseCase } from '@/domain/habits/application/use-cases/fetch-by-date-goal';
import { ToggleGoalController } from './controllers/goal/toggle-goal.controller';
import { ToogleGoalUseCase } from '@/domain/habits/application/use-cases/toggle-goal';
import { GetByIdGoalUseCase } from '@/domain/habits/application/use-cases/get-by-id-goal';
import { GetByIdGoalController } from './controllers/goal/get-by-id-goal.controller';
import { FetchStatsByWeekhHabitsUseCase } from '@/domain/habits/application/use-cases/fetch-stats-by-week';
import { FetchStatsByWeekHabitsController } from './controllers/habit/fetch-stats-by-week-habits.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateUserController,
    RegisterUserController,
    GetByIdUserController,
    UpdateUserController,
    DeleteUserController,
    FetchStatsByMonthHabitsController,
    CreateHabitController,
    DeleteHabitController,
    FetchHabitByDateController,
    GetByIdHabitController,
    ToggleHabitController,
    UpdateHabitController,
    CreateGoalController,
    DeleteGoalController,
    UpdateGoalController,
    FetchGoalByDateController,
    ToggleGoalController,
    GetByIdGoalController,
    FetchStatsByWeekHabitsController
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    GetByIdUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FetchStatsByMonthHabitsUseCase,
    CreateHabitUseCase,
    DeleteHabitUseCase,
    FetchByDateHabitUseCase,
    GetByIdHabitUseCase,
    ToogleHabitUseCase,
    UpdateHabitUseCase,
    CreateGoalUseCase,
    DeleteGoalUseCase,
    UpdateGoalUseCase,
    FetchByDateGoalUseCase,
    ToogleGoalUseCase,
    GetByIdGoalUseCase,
    FetchStatsByWeekhHabitsUseCase
  ],
})
export class HttpModule { }
