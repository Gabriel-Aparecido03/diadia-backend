import { UniqueEntityID } from "@/domain/core/unique-entity-id";
import { User } from "@/domain/habits/enterprise/entities/user";
import { User as PrismaUser } from "@prisma/client";


export class PrismaUserMapper {
  toDomain({ createdAt ,email,id ,password ,updatedAt,name} : PrismaUser) : User {
    return User.create({
      email,
      name,
      password,
      createdAt,
      updatedAt
    },new UniqueEntityID(id))
  }

  toPrisma(raw : User) : PrismaUser {
    return {
      createdAt : raw.createdAt,
      email : raw.email,
      id : raw.id.toString(),
      password : raw.password,
      updatedAt : raw.updatedAt,
      name : raw.name
    }
  }
}