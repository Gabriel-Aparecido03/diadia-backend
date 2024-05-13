import { UniqueEntityID } from "@/domain/core/unique-entity-id";
import { Day } from "@/domain/habits/enterprise/entities/day";
import { Day as PrismaDay } from "@prisma/client";


export class PrismaDayMapper {
  toDomain(raw : PrismaDay) : Day {
    return Day.create({
      date : raw.date,
    },new UniqueEntityID(raw.id))
  }

  toPrisma(raw : Day) : PrismaDay {
    return {
      date : raw.date,
      id : raw.id.toString()
    }
  }
}