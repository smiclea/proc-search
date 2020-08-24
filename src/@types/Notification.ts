export enum SeverityLevel {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success'
}

export type NotificationItem = {
  id: number
  severity: SeverityLevel
  message: string
}
