import { WatchedList } from "@/domain/core/watched-list";
import { Weekday } from "./weekday";

export class WeekdayList extends WatchedList<Weekday> {
  compareItems(a: Weekday, b: Weekday): boolean {
    return a.weekday === b.weekday  && a.timeInSeconds === b.timeInSeconds
  }
}