import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class HashGenerator {
  abstract encrypt(plain : string) : Promise<string>
}