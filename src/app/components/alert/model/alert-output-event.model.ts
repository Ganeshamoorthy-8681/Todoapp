export enum AlertOutputEventTypes {
  ALERT_CLOSE = "ALERT_CLOSE"
}

export interface AlertOutputEventModel {
  eventType: AlertOutputEventTypes;
  data: MouseEvent;
}
