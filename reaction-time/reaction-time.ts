enum State {
  READY,
  WAIT,
  CLICK,
  ERROR,
  RESULT
}

const gameState = {
  state: State.READY,
  round: 1,
}

const clickElement: HTMLElement = document.getElementById('click-element')!
const reactionTable: HTMLElement = document.getElementById('reaction-table')!
const maxRounds: number = 2
const minWaitTime: number = 800
const addWaitTime: number = 2000
let waitTime: number = 0
let currTime: number = 0
let reactionTimes: number[] = []
let timeoutId: number



function readyScreen() {
  clickElement.style.background = '#00c0de'
  clickElement.innerHTML = `
    <h1>Test your reaction time</h1>
    <p>Click here to start</p>`
  clickElement.innerHTML += `<p><b>Results:</b> ${getResultsString()} ms</p><p>Average: ${getAverageTime()}`
  gameState.round = 1
  gameState.state = State.READY
  reactionTimes = []
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
  reactionTimes.push(reactionTime)
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
  reactionTimesArr.push(reactionTimes)
  createTableRow()
  updateLocalStorage()
}

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

// Create table row
function createTableRow() {
  const row: HTMLElement = document.createElement('tr')
  reactionTimes.forEach((time) => {
    const cell: HTMLElement = document.createElement('td')
    cell.textContent = time.toString()
    row.appendChild(cell)
  })
  const cellAverage: HTMLElement = document.createElement('td') 
  cellAverage.textContent = getAverageTime().toString()
  row.appendChild(cellAverage);

  reactionTable.appendChild(row);
}



// Get & set localStorage
let reactionTimesArr: number[][] = []
function getLocalStorage() {
  const result = window.localStorage.getItem('reactionTimes')
  if (result !== null)
    reactionTimesArr = JSON.parse(result)
}
function updateLocalStorage() {
  window.localStorage.setItem('reactionTimes', JSON.stringify(reactionTimesArr))
}



// Utility functions
function getAverageTime() {
  return reactionTimes.reduce((total, currValue) => total + currValue, 0) / reactionTimes.length
}

function getResultsString(): string {
  let times: string = ''
  reactionTimes.forEach((time) => {
    times += time + ' '
  })
  return times;
}



// Run setup function
getLocalStorage()