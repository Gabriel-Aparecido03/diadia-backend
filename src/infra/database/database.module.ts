import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { UserRepository } from "@/domain/habits/application/repositories/user-repository";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user-repository";
import { HabitRepository } from "@/domain/habits/application/repositories/habit-repository";
import { PrismaHabitRepository } from "./prisma/repositories/prisma-habit-repository";
import { DayRepository } from "@/domain/habits/application/repositories/day-repository";
import { PrismaDayRepository } from "./prisma/repositories/prisma-day-repository";
import { GoalRepository } from "@/domain/habits/application/repositories/goal-repository";
import { PrismaGoalRepository } from "./prisma/repositories/prisma-goal-repository";

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide : UserRepository,
      useClass : PrismaUserRepository
    },
    {
      provide : HabitRepository,
      useClass : PrismaHabitRepository
    },
    {
      provide : DayRepository,
      useClass : PrismaDayRepository
    },
    {
      provide : GoalRepository,
      useClass : PrismaGoalRepository
    }
  ],
  exports: [
    PrismaService,
    UserRepository,
    HabitRepository,
    DayRepository,
    GoalRepository
  ]
})
export class DatabaseModule { }
