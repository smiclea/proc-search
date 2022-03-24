import React from 'react'

import processStore from './ProcessStore'
import notificationStore from './NotificationStore'

export default () => React.useContext(React.createContext({
  processStore,
  notificationStore,
}))
