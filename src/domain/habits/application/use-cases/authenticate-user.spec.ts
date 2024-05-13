import { InTestEncrypter } from "test/cryptoghphay/in-test-encrypter"
import { InTestHashComparer } from "test/cryptoghphay/in-test-hash-comparer"
import { InvalidCredentials } from "./errors/invalid-credentials"
import { UserRepositoryInMemory } from "test/repositories/in-memory-user-repository"
import { AuthenticateUserUseCase } from "./authenticate-user"
import { makeUser } from "test/factories/make-user"

describe('Authtenticate user use case - Unit', () => {
  let sut: AuthenticateUserUseCase
  let hasherComparer: InTestHashComparer
  let encrypter: InTestEncrypter
  let inMemoryUserRepository: UserRepositoryInMemory

  beforeEach(() => {
    inMemoryUserRepository = new UserRepositoryInMemory()
    hasherComparer = new InTestHashComparer()
    encrypter = new InTestEncrypter()
    sut = new AuthenticateUserUseCase(inMemoryUserRepository, hasherComparer, encrypter)
  })

  it('should be to authtenticate of user account', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)
    const result = await sut.execute({ email: user.email, password: 'password' })

    expect(result).toEqual(
      expect.objectContaining({
        access_token: expect.any(String)
      })
    )
  })

  it('not should be to authtenticate of user account with wrong email', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)
    expect(async () => {
      await sut.execute({ email: 'wrong', password: 'password' })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('not should be to authtenticate of user account with wrong password', async () => {
    const user = makeUser({ password: 'password-hashed' })
    inMemoryUserRepository.create(user)
    expect(async () => {
      await sut.execute({ email: user.email, password: 'wrong-password' })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })
})