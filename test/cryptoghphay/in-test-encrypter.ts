import { Encrypter } from "@/domain/habits/application/cryptography/encrypter";

export class InTestEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
  
}