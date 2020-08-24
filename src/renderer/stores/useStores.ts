import React from 'react'

import processStore from './ProcessStore'
import notificationStore from './NotificationStore'

const context = React.createContext({
  processStore,
  notificationStore,
})

export default () => React.useContext(context)
