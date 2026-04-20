// DARK / LIGHT MODE SWITCHER
// variables
let theme = localStorage.getItem('theme')
const themeSwitch = document.getElementById('theme-switch')!
const preferLight = window.matchMedia("(prefers-color-scheme: light)").matches

// Functions
const setDarkMode = () => {
  document.body.classList.remove('lightmode')
  localStorage.setItem('theme', 'dark')
  theme = 'dark'
  themeSwitch.setAttribute('aria-pressed', 'false')
}
const setLightMode = () => {
  document.body.classList.add('lightmode')
  localStorage.setItem('theme', 'light')
  theme = 'light'
  themeSwitch.setAttribute('aria-pressed', 'true')
}

if ((theme === null && preferLight === true) || theme === 'light')
  setLightMode()


themeSwitch.addEventListener('click', () => {
  theme === 'dark' ? setLightMode() : setDarkMode()
})



// MOBILE SIDE MENU
// Variables
const hamburgerMenu: HTMLElement = document.getElementById('open-navbar-button')!
const hamburgerMenuClose: HTMLElement = document.getElementById('close-navbar-button')!
const navbar: HTMLElement = document.getElementById('navbar')!
const navbarOverlay: HTMLElement = document.getElementById('close-navbar-button')!
const media: MediaQueryList = window.matchMedia("(width < 601px)")
const navLinks: NodeList = document.querySelectorAll('nav a')
let isMobile: boolean


// Event listeners
hamburgerMenu.addEventListener('click', () => openNavbar())
hamburgerMenuClose.addEventListener('click', () => closeNavbar())
navbarOverlay.addEventListener('click', () => closeNavbar())
media.addEventListener('change', (e) => updateNavbar(e))

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeNavbar()
  })
})


// Functions
function updateNavbar(e: MediaQueryList | MediaQueryListEvent) {
  isMobile = e.matches

  if (isMobile)
    navbar.setAttribute('inert', '')
  else
    navbar.removeAttribute('inert')
}
function openNavbar() {
  console.log('Clicked')
  if (isMobile) {
    document.body.classList.add('nav-open')
    hamburgerMenu.setAttribute('aria-expanded', 'true')
    navbar.removeAttribute('inert')
  }
}
function closeNavbar() {
  if (isMobile) {
    document.body.classList.remove('nav-open')
    hamburgerMenu.setAttribute('aria-expanded', 'false')
    navbar.setAttribute('inert', '')
  }
}

updateNavbar(media)
