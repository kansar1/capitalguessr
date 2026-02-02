import { useEffect, useState } from 'react'
import './App.css'
import dictionary from './Dictionary'

function App() {
  const [usedCountries, setUsedCountries] = useState<string[]>([])
  const [country, setCountry] = useState(() => pickCountry([]))
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [outOf, setOutOf] = useState(0)
  const [timer, setTimer] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  
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
    setTimer(60)
    setGameOver(false)
    setGameStarted(false)
    setScore(0)
    setOutOf(0)
    setUsedCountries([])
    setCountry(pickCountry([]))
    setAnswer('')
    setFeedback('')
  }

  if (!gameStarted) {
    return (
      <div className="App">
        <div className="Centered-Main">
          <h1> CapitalGuessr </h1>
          <h2> Welcome! </h2>
          <p> Test your knowledge of world capitals </p>
          <p> You have <strong>{timer}</strong> seconds to answer as many as you can </p>
          <button onClick={() => setGameStarted(true)} className="Submit-Button"> Start Game </button>
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
            
            // Check if all countries have been used
            const totalCountries = Object.keys(dictionary).length
            if (newUsedCountries.length >= totalCountries) {
              setGameOver(true)
              return
            }
            
            setCountry(pickCountry(newUsedCountries))
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
              
              // Check if all countries have been used
              const totalCountries = Object.keys(dictionary).length
              if (newUsedCountries.length >= totalCountries) {
                setGameOver(true)
                return
              }
              
              setCountry(pickCountry(newUsedCountries))
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

function pickCountry(usedCountries: string[]): string {
  const allCountries = Object.keys(dictionary)
  const availableCountries = allCountries.filter(c => !usedCountries.includes(c))
  
  const randomIndex = Math.floor(Math.random() * availableCountries.length)
  return availableCountries[randomIndex]
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
