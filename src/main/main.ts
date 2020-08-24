import {
  app, BrowserWindow, Tray, Menu,
} from 'electron'
import path from 'path'
import url from 'url'

require('dotenv').config()

let mainWindow: Electron.BrowserWindow | null
let tray = null

const gotTheLock = app.requestSingleInstanceLock()

let shouldClose = false

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

  tray = new Tray(path.join(__dirname, 'icon.png'))
  tray.setToolTip('Proc-Search')
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
          mainWindow?.show()
      },
    },
    {
      label: 'Quit',
      click: () => {
        shouldClose = true
        app.quit()
      },
    },
  ]))
  tray.on('double-click', () => {
    mainWindow?.show()
  })

  mainWindow.on('minimize', (event: any) => {
    event.preventDefault()
    mainWindow?.hide()
  })

  mainWindow.on('close', event => {
    if (shouldClose) {
      return
    }
    event.preventDefault()
    mainWindow?.minimize()
  })

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
