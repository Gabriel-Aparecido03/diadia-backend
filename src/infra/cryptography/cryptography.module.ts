import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt";
import { JwtEncrypter } from "./jwt-encrypter";
import { Encrypter } from "@/domain/habits/application/cryptography/encrypter";
import { HashComparer } from "@/domain/habits/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/habits/application/cryptography/hash-generator";

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule{}