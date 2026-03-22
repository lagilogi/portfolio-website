// All different states for the reaction speed game
enum State {
  READY,
  WAIT,
  CLICK,
  ERROR,
  RESULT
}

// The object to keep track of game state and round
const gameState = {
  state: State.READY,
  round: 1,
}

// Global variables
const clickElement: HTMLElement = document.getElementById('click-element')!
const reactionTable: HTMLElement = document.getElementById('reaction-table')!
const maxRounds: number = 2
const minWaitTime: number = 800
const addWaitTime: number = 2000
let waitTime: number = 0
let currTime: number = 0
let currReactionTimes: number[] = []
let timeoutId: number



// Game functions
function readyScreen() {
  clickElement.style.background = '#00c0de'
  clickElement.innerHTML = `
    <h1>Test your reaction time</h1>
    <p>Click here to start</p>`
  clickElement.innerHTML += `<p><b>Results:</b> ${getResultsString()} ms</p><p>Average: ${getAverageTime(currReactionTimes)}`
  gameState.round = 1
  gameState.state = State.READY
  currReactionTimes = []
}
function waitScreen() {
  clickElement.style.background = 'var(--red)'
  clickElement.innerHTML = `
    <p>Wait..</p>
    <p>Round ${gameState.round} / ${maxRounds}</p>`
  gameState.state = State.WAIT
  waitTime = minWaitTime + Math.floor(Math.random() * addWaitTime)
  timeoutId = setTimeout(() => {
    clickScreen()
  }, waitTime)
}
function clickScreen() {
  clickElement.style.background = '#60e663'
  clickElement.innerHTML = '<p>CLICK!</p>'
  currTime = Date.now()
  gameState.state = State.CLICK
}
function resultScreen() {
  const reactionTime = Date.now() - currTime
  clickElement.style.background = 'green'
  clickElement.innerHTML = `
    <p>${reactionTime} ms - Round ${gameState.round} / ${maxRounds}</p>
    <p><i>Click for next round</i></p>`
  currReactionTimes.push(reactionTime)
  gameState.state = State.RESULT
  gameState.round += 1;
}
function errorScreen() {
  clearTimeout(timeoutId)
  clickElement.innerHTML = `
    <p>You clicked too soon. Wait for the background to turn green.</p>
    <p>Click to continue</p>`
  gameState.state = State.ERROR
}
function updateReactionTimes() {
  let p: HTMLElement = document.createElement('p')
  console.log(reactionTimesArr)
  reactionTimesArr.push(currReactionTimes)
  createTableRow(currReactionTimes)
  updateLocalStorage()
}

// This function gets called everytime a user clicks on the banner on the page. After the click we check what the game state is, and what to do next
function runReactionTime() {
  if (gameState.state === State.READY) {
    waitScreen()
  }
  else if (gameState.state === State.WAIT) {
    errorScreen()
  }
  else if (gameState.state === State.CLICK) {
    resultScreen()
  }
  else if (gameState.state === State.ERROR) {
    waitScreen()
  }
  else if (gameState.state === State.RESULT) {
    if (gameState.round <= maxRounds) {
      waitScreen()
    }
    else if (gameState.round > maxRounds) {
      updateReactionTimes()
      readyScreen()
    }
  }
}


// Create table row to show on the page
function createTableRow(reactionTimes: number[]) {
  const row: HTMLElement = document.createElement('tr')
  reactionTimes.forEach((time) => {
    const cell: HTMLElement = document.createElement('td')
    cell.textContent = time.toString()
    row.appendChild(cell)
  })
  const cellAverage: HTMLElement = document.createElement('td')
  cellAverage.textContent = getAverageTime(reactionTimes).toString()
  row.appendChild(cellAverage);

  reactionTable.appendChild(row);
}



// Get & set localStorage for persistent user data.
let reactionTimesArr: number[][] = []

// We check if localstorage contains reactionTimes key. If yes, we retrieve the value and store it in 'reactionTimesArr' - then use that to generate the
function getLocalStorage() {
  const result = window.localStorage.getItem('reactionTimes')
  if (result !== null) {
    reactionTimesArr = JSON.parse(result)
    reactionTimesArr.forEach((times) => {
      createTableRow(times)
    })
  }
}
function updateLocalStorage() {
  window.localStorage.setItem('reactionTimes', JSON.stringify(reactionTimesArr))
}



// Utility functions
function getAverageTime(reactionTimes: number[]) {
  return Math.round(reactionTimes.reduce((total, currValue) => total + currValue, 0) / reactionTimes.length)
}

function getResultsString(): string {
  let times: string = ''
  currReactionTimes.forEach((time) => {
    times += time + ' '
  })
  return times;
}



// Run setup function
getLocalStorage()
