import {
  app, BrowserWindow,
} from 'electron'
import path from 'path'
import url from 'url'

require('dotenv').config()

let mainWindow: Electron.BrowserWindow | null

const gotTheLock = app.requestSingleInstanceLock()

const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      devTools: process.env.NODE_ENV === 'development',
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#303030',
  })

  if (process.env.NODE_ENV !== 'development') {
    mainWindow.setMenu(null)
  } else {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  )

  return mainWindow
}

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow?.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow?.focus()
  })

  app.whenReady().then(async () => {
    mainWindow = await createMainWindow()
  })
}
