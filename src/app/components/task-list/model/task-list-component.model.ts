import { BehaviorSubject } from "rxjs";

export interface TaskListComponentModel {
  title: string;
  isTodaysTask?: boolean;
  isFilterRequired?: boolean;
  $refreshDataSubject?: BehaviorSubject<boolean>;
}
