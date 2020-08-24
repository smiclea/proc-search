import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Alert, AlertTitle } from '@material-ui/lab'

import useStores from '../../stores/useStores'
import { wait } from '../../../utils/utils'

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 16px;
  padding: 0 16px;
  margin-top: -16px;
  z-index: 9999;
`
const NotificationItem = styled.div<{ isFading: boolean }>`
  opacity: ${props => (props.isFading ? 0 : 1)};
  margin-top: 16px;
  transition: opacity 250ms;
`

const Notifications = () => {
  const [fadingNotification, setFadingNotification] = useState(0)
  const { notificationStore } = useStores()

  const handleCloseNotification = async (id: number) => {
    setFadingNotification(id)
    await wait(250)
    notificationStore.remove(id)
  }

  return (
    <Wrapper>
      {notificationStore.notifications.map(notificationItem => (
        <NotificationItem
          key={notificationItem.id}
          onClick={() => { handleCloseNotification(notificationItem.id) }}
          isFading={fadingNotification === notificationItem.id}
        >
          <Alert severity={notificationItem.severity}>
            <AlertTitle>{notificationItem.severity.toUpperCase()}</AlertTitle>
            <pre>{notificationItem.message}</pre>
          </Alert>
        </NotificationItem>
      ))}
    </Wrapper>
  )
}

export default observer(Notifications)
