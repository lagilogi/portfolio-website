
// DARK / LIGHT MODE SWITCHER
// variables
let theme = localStorage.getItem('theme')
const themeSwitch = document.getElementById('theme-switch')
const preferLight = window.matchMedia("(prefers-color-scheme: light)").matches

// Functions
const setDarkMode = () => {
  document.body.classList.remove('lightmode')
  localStorage.setItem('theme', 'dark')
  theme = 'dark'
  themeSwitch.setAttribute('aria-pressed', false)
}
const setLightMode = () => {
  document.body.classList.add('lightmode')
  localStorage.setItem('theme', 'light')
  theme = 'light'
  themeSwitch.setAttribute('aria-pressed', true)
}

if ((theme === null && preferLight === true) || theme === 'light')
  setLightMode()


themeSwitch.addEventListener('click', () => {
  theme === 'dark' ? setLightMode() : setDarkMode()
})



// MOBILE SIDE MENU
// Variables
const hamburgerMenu = document.getElementById('open-navbar-button')
const navbar = document.getElementById('navbar')
const media = window.matchMedia("(width < 601px)")
const navLinks = document.querySelectorAll('nav a')
let isMobile


// Event listeners
media.addEventListener('change', (e) => updateNavbar(e))

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeNavbar()
  })
})


// Functions
function updateNavbar(e) {
  isMobile = e.matches

  if (isMobile)
    navbar.setAttribute('inert', '')
  else
    navbar.removeAttribute('inert')
}
function openNavbar() {
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
