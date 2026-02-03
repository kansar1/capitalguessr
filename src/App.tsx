import { useEffect, useState } from 'react'
import './App.css'
import dictionary from './Dictionary'
import { difficultyCountries, type DifficultyLevel } from './Dictionary'

type Difficulty = DifficultyLevel

const TIMER_DURATION = 30

function App() {
  const [usedCountries, setUsedCountries] = useState<string[]>([])
  const [country, setCountry] = useState<string>('')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [outOf, setOutOf] = useState(0)
  const [timer, setTimer] = useState(TIMER_DURATION)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)

  
  useEffect(() => {
    if (!gameStarted || gameOver) return
    
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown)
          setGameOver(true)
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)
    
    return () => clearInterval(countdown)
  }, [gameStarted, gameOver])

  const restartGame = () => {
    setTimer(TIMER_DURATION)
    setGameOver(false)
    setGameStarted(false)
    setDifficulty(null)
    setScore(0)
    setOutOf(0)
    setUsedCountries([])
    setCountry('')
    setAnswer('')
    setFeedback('')
  }

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty)
    setTimer(TIMER_DURATION)
    const newCountry = pickCountry([], selectedDifficulty)
    setCountry(newCountry)
    setGameStarted(true)
  }

  if (!gameStarted) {
    return (
      <div className="App">
        <div className="Centered-Main">
          <h1> CapitalGuessr </h1>
          <h2> Welcome! </h2>
          <p> Test your knowledge of world capitals </p>
          <p> Select a difficulty level: </p>
          <div className="Difficulty-Selection">
            <button onClick={() => startGame('easy')} className="Difficulty-Button Easy"> 
              Easy 
              <p className="Difficulty-Info">(Well-known countries)</p>
            </button>
            <button onClick={() => startGame('medium')} className="Difficulty-Button Medium"> 
              Medium 
              <p className="Difficulty-Info">(Mixed difficulty)</p>
            </button>
            <button onClick={() => startGame('hard')} className="Difficulty-Button Hard"> 
              Hard 
              <p className="Difficulty-Info">(Obscure countries)</p>
            </button>
          </div>
          <p> Made by <a href="https://github.com/kansar1/capitalguessr" target="_blank" rel="noopener noreferrer">kansar1</a> on Github </p>  
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="App">
        <header className="GameHeader">
          <h1> CapitalGuessr </h1>
        </header>
        <div className="Centered-Main">
          <h2> Game Over! </h2>
          <h3> Final Score: {score} / {outOf} </h3>
          <h4> Accuracy: {outOf > 0 ? Math.round((score / outOf) * 100) : 0}% </h4>
          <button onClick={restartGame} className='Submit-Button'> Play Again </button>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="GameHeader">
        <h1> CapitalGuessr </h1>
      </header>
      <div className="Centered-Main">
        <h4> Guess the capital correctly </h4>
        <h2> Time Remaining: {timer} seconds </h2>
        <h3> Score: {score} / {outOf} </h3>
        <h4> Difficulty: <span className={`Difficulty-Label ${difficulty}`}>{difficulty?.toUpperCase()}</span> </h4>
        <hr/>
        <h3> What is the capital of {country}? </h3>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (gameOver) return
            const correctCapital = checkForCapital(country)
            const isCorrect = isAnswerCorrect(answer, correctCapital)
            if (isCorrect) {
              setFeedback('Correct!')
              setScore(score + 1)
            } else {
              const displayAnswer = Array.isArray(correctCapital) ? correctCapital.join(' or ') : correctCapital
              setFeedback(`Incorrect! The answer is ${displayAnswer}`)
            }
            setOutOf(outOf + 1)
            const newUsedCountries = [...usedCountries, country]
            setUsedCountries(newUsedCountries)
            
            // Check if all countries have been used for this difficulty
            const availableCountries = difficultyCountries[difficulty!]
            if (newUsedCountries.length >= availableCountries.length) {
              setGameOver(true)
              return
            }
            
            setCountry(pickCountry(newUsedCountries, difficulty!))
            setAnswer('')
          }}
        >
          <label> Type your answer here: </label>
          <input
          type="text"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          />
          <div className="Button">
            <button type="submit" className='Submit-Button'> Submit </button>    
            <button type="button" 
            className='Skip-Button'
            onClick={() => {
              const newUsedCountries = [...usedCountries, country]
              setUsedCountries(newUsedCountries)
              
              // Check if all countries have been used for this difficulty
              const availableCountries = difficultyCountries[difficulty!]
              if (newUsedCountries.length >= availableCountries.length) {
                setGameOver(true)
                return
              }
              
              setCountry(pickCountry(newUsedCountries, difficulty!))
              setAnswer('')
              setOutOf(outOf + 1)
              setFeedback(`Skipped! The answer was ${checkForCapital(country)}`)
            }}
            > Skip </button>
          </div>
        </form>
        {feedback && <p>{feedback}</p>}
      </div>
    </div>
  )
}

function pickCountry(usedCountries: string[], difficulty: Difficulty): string {
  const availableCountries = difficultyCountries[difficulty]
  const filteredCountries = availableCountries.filter(c => !usedCountries.includes(c))
  
  const randomIndex = Math.floor(Math.random() * filteredCountries.length)
  return filteredCountries[randomIndex]
}

function checkForCapital(country: string): string | string[] | undefined {
  return dictionary[country]
}

function isAnswerCorrect(answer: string, capital: string | string[] | undefined): boolean {
  if (!capital) return false
  const upperAnswer = answer.trim().toUpperCase()
  if (Array.isArray(capital)) {
    return capital.some(c => c.toUpperCase() === upperAnswer)
  }
  return capital.toUpperCase() === upperAnswer
}

export default App
