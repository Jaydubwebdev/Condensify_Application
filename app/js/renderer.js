const { ipcRenderer } = require('electron')
const path = require('path')
const os = require('os')

// Form Variables
const form = document.getElementById('image-form')
const slider = document.getElementById('slider')
const image = document.getElementById('image')

// Get Chosen Image Path
form.addEventListener('submit', e => {
    e.preventDefault()

    const imagePath = image.files[0].path
    const quality = slider.value

    ipcRenderer.send('image:condensify', {
        imagePath: imagePath,
        quality: quality
    })
})

// Get Confirmation from Main
ipcRenderer.on('image:condensed', () => {
    var toastHTML = `<span>Image resized to ${slider.value}% quality!</span>`
    M.toast({ html: toastHTML });
    document.getElementById('image-form').reset()
})