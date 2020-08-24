import { observable, action } from 'mobx'
import { NotificationItem, SeverityLevel } from '../../@types/Notification'

class NotificationStore {
  @observable
  notifications: NotificationItem[] = []

  @action
  show(severity: SeverityLevel, message: string) {
    this.notifications = [
      ...this.notifications,
      {
        id: new Date().getTime(),
        severity,
        message,
      },
    ]
  }

  @action
  remove(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id)
  }
}

export default new NotificationStore()
