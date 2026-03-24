// ----- Model -----
enum State {
  READY,
  WAIT,
  CLICK,
  ERROR,
  RESULT
}

const config = {
  maxRounds: 4,
  minWaitTime: 800,
  addWaitTime: 2000,
}

const game = {
  state: State.READY,
  round: 1,

  currentTime: 0,
  timeoutId: -1,

  currReactionTime: 0,
  currReactionTimes: [] as number[],
  allReactionTimes: [] as number[][],
}

const clickElement: HTMLElement = document.getElementById('click-element')!
const reactionTable: HTMLElement = document.getElementById('reaction-table')!


// ----- Controller -----
function readyScreen() {
  game.round = 1
  game.state = State.READY
  render()
  game.currReactionTimes = []
}
function waitScreen() {
  game.state = State.WAIT
  render()
  const waitTime = config.minWaitTime + Math.floor(Math.random() * config.addWaitTime)
  game.timeoutId = setTimeout(() => {
    clickScreen()
  }, waitTime)
}
function clickScreen() {
  game.currentTime = Date.now()
  game.state = State.CLICK
  render()
}
function resultScreen() {
  game.currReactionTime = Date.now() - game.currentTime
  game.state = State.RESULT
  game.currReactionTimes.push(game.currReactionTime)
  render()
  game.round += 1;
}
function errorScreen() {
  game.state = State.ERROR
  clearTimeout(game.timeoutId)
  render()
}
function updateReactionTimes() {
  game.allReactionTimes.push(game.currReactionTimes)
  renderTableRow(game.currReactionTimes)
  updateLocalStorage()
}
function runReactionTime() {
  if (game.state === State.READY) {
    waitScreen()
  }
  else if (game.state === State.WAIT) {
    errorScreen()
  }
  else if (game.state === State.CLICK) {
    resultScreen()
  }
  else if (game.state === State.ERROR) {
    waitScreen()
  }
  else if (game.state === State.RESULT) {
    if (game.round <= config.maxRounds) {
      waitScreen()
    }
    else if (game.round > config.maxRounds) {
      updateReactionTimes()
      readyScreen()
    }
  }
  console.log('gamestate:', game.state)
}

function getAverageTime(reactionTimes: number[]) {
  if (reactionTimes.length > 0)
    return Math.round(reactionTimes.reduce((total, currValue) => total + currValue, 0) / reactionTimes.length)
  else
    return -1
}

function getResultsString(): string {
  let times: string = ''
  game.currReactionTimes.forEach((time) => {
    times += time + ' '
  })
  return times;
}

function updateLocalStorage() {
  window.localStorage.setItem('reactionTimes', JSON.stringify(game.allReactionTimes))
}


// ----- View -----
function render() {
  switch (game.state) {
    case State.READY:
      renderBanner('var(--blue)', `
        <h1>Test your reaction time</h1>
        <p>Click here to start</p>
        <p>Results:<br>${getResultsString()} ms</p>
        <p>Average: ${getAverageTime(game.currReactionTimes)}`)
      break
    case State.WAIT:
      renderBanner('var(--red)', `
        <p>Wait..</p>
        <p>Round ${game.round} / ${config.maxRounds}</p>`)
      break
    case State.CLICK:
      renderBanner('var(--lightgreen)', '<p>CLICK!</p>')
      break
    case State.ERROR:
      renderBanner('var(--red)', `
        <p>You clicked too soon. Wait for the background to turn green.</p>
        <p>Click to continue</p>`)
      break
    case State.RESULT:
      renderBanner('var(--green)', `
        <p>${game.currReactionTime} ms - Round ${game.round} / ${config.maxRounds}</p>
        <p><i>Click for next round</i></p>`)
      break
  }
}

function renderBanner(bgcolor: string, text: string) {
  clickElement.style.background = bgcolor;
  clickElement.innerHTML = text
}

function renderTableRow(reactionTimes: number[]) {
  const row: HTMLTableRowElement = document.createElement('tr')
  reactionTimes.forEach((time) => {
    const cell: HTMLTableCellElement = document.createElement('td')
    cell.textContent = time.toString()
    row.appendChild(cell)
  })
  const cellAverage: HTMLTableCellElement = document.createElement('td')
  cellAverage.textContent = getAverageTime(reactionTimes).toString()
  row.appendChild(cellAverage);

  reactionTable.appendChild(row);
}


// ----- Startup -----
function checkIfValidTimesArray(value: unknown): boolean {
  return Array.isArray(value) &&
    value.every(
      row => Array.isArray(row) &&
        row.every(cell => typeof cell === "number")
    );
}
function getLocalStorage(): number[][] {
  const result = window.localStorage.getItem('reactionTimes')
  console.log(result)

  if (result !== null) {
    try {
      const parsedResult = JSON.parse(result)
      if (checkIfValidTimesArray(parsedResult))
        return parsedResult
    } catch (e) {
      console.error("Couldn't retrieve previous rounds data")
    }
  }
  else
    console.log('No data found')
  return []
}

function startup() {
  game.allReactionTimes = getLocalStorage()
  if (game.allReactionTimes.length > 0)
    game.allReactionTimes.forEach(ele => renderTableRow(ele))
  clickElement.addEventListener('click', () => runReactionTime())
}

startup()