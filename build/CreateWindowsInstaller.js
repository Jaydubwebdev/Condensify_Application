const CreateWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const pjson = require('../package.json')
const path = require('path')

// Build Installer.exe
GetInstallerConfig()
    .then(CreateWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error)
        process.exit(1)
    })

// Installer.exe Config
function GetInstallerConfig() {
    console.log('creating windows installer')
    const rootPath = path.join('./')
    const outPath = path.join(rootPath, 'dist/')
    // Installer Metadata
    return Promise.resolve({
        appDirectory: path.join(outPath, 'release-builds', 'Condensify-win32-ia32/'),
        authors: 'James Walsh',
        noMsi: true,
        outputDirectory: path.join(outPath, `windows-installer/Condensify-${pjson.version}`),
        exe: 'Condensify.exe',
        setupExe: `CondensifyInstaller-${pjson.version}.exe`,
        setupIcon: path.join(rootPath, 'assets/', 'Icon.ico'),
        iconUrl: `${__dirname}/assets/Icon.ico`,
        title: `Condensify-${pjson.version}`
    })
}