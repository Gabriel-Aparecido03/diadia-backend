import { HashComparer } from '@/domain/habits/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/habits/application/cryptography/hash-generator'
import { hash, compare } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  async encrypt(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  async comparer(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }

}