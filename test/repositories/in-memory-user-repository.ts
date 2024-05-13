import { UserRepository } from "@/domain/habits/application/repositories/user-repository"
import { User } from "@/domain/habits/enterprise/entities/user"

export class UserRepositoryInMemory implements UserRepository {

  public items: User[] = []

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex(i => i.id.equals(user.id))
    this.items[index] = user
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(i => i.id.toString() !== id)
  }

  async getEmail(email: string): Promise<User> {
    const user = this.items.find(i => i.email === email)
    return user
  }

  async getById(id: string): Promise<User> {
    const user = this.items.find(i => i.id.toString() === id)
    return user
  }

}