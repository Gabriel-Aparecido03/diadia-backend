import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";

@Injectable()
export abstract class UserRepository {
  abstract create(user: User): Promise<void>
  abstract update(user: User): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract getEmail(email: string): Promise<User>
  abstract getById(id: string): Promise<User>
}