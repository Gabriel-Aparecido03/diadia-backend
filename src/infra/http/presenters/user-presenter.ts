import { User } from "../../../domain/habits/enterprise/entities/user";

export class UserPresenter {
  toHttp(user : User) {
    return {
      id : user.id.toString(),
      name : user.name,
      email : user.email,
      updatedAt : user.updatedAt,
      createdAt : user.createdAt,
    }
  }
}