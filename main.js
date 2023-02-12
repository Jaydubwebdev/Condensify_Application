const { app, BrowserWindow, ipcMain, shell } = require('electron')
const electronReload = require('electron-reload')(__dirname)
const pjson = require('./package.json')
const path = require('path')
const os = require('os')

const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const slash = require('slash')

// Squirrel
const windowsInstaller = require('./build/WindowsInstaller')
if (windowsInstaller.handleSquirrelEvent()) {
    return
}

// Environment Setting
process.env.NODE_ENV = 'production'

// Environment Variables
const devMode = process.env.NODE_ENV !== 'production' ? true : false
const macOS = process.env.NODE_ENV === 'darwin' ? true : false

// Application Window
let window
function createWindow() {
    window = new BrowserWindow({
        title: `Condensify-v${pjson.version}`,
        width: devMode ? 500 : 500,
        height: 500,
        resizable: devMode,
        autoHideMenuBar: !devMode,
        icon: `${__dirname}/assets/Icon.png`,
        backgroundColor: '#232323',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    })
    window.loadFile('app/index.html')
}

// Instantiate Application Window
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Close Application Window
app.on('window-all-closed', () => {
    if (!macOS) {
        app.quit()
    }
})

// Get Image from Renderer
ipcMain.on('image:condensify', (e, options) => {
    // Create Output Path Option
    options.destinationPath = path.join(os.homedir(), '/Condensify')
    CondensifyImage(options)
})

// Imagemin to Reduce Image Quality
async function CondensifyImage({ imagePath, quality, destinationPath }) {
    try {
        const files = await imagemin([slash(imagePath)], {
            destination: destinationPath,
            plugins: [
                imageminMozjpeg({ quality }),
                imageminPngquant({
                    quality: [quality / 100, quality / 100],
                }),
            ],
        })
        shell.openPath(destinationPath)
        window.webContents.send('image:condensed')
    } catch (err) {
        console.log(err)
    }
}