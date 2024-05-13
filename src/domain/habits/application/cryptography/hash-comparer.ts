import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class HashComparer {
  abstract comparer(plain : string,hash : string) : Promise<boolean>
}