import { useEffect, useState } from 'react'
import './App.css'
import dictionary from './Dictionary'

function App() {
  const [country, setCountry] = useState(pickCountry())
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [outOf, setOutOf] = useState(0)
  const [timer, setTimer] = useState(60)
  const [gameOver, setGameOver] = useState(false)

  
  useEffect(() => {
    if (gameOver) return
    
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
  }, [gameOver])

  const restartGame = () => {
    setTimer(60)
    setGameOver(false)
    setScore(0)
    setOutOf(0)
    setCountry(pickCountry())
    setAnswer('')
    setFeedback('')
  }

  if (gameOver) {
    return (
      <div className="App">
        <div className="Centered Main">
          <h1> Game Over! </h1>
          <h2> Final Score: {score} / {outOf} </h2>
          <h3> Accuracy: {outOf > 0 ? Math.round((score / outOf) * 100) : 0}% </h3>
          <button onClick={restartGame}> Play Again </button>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <div className="Centered Main">
        <h1> CapitalGuessr </h1>
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
          }}
        >
          <label> Type your answer here: </label>
          <input
          type="text"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          />
          <button type="submit"> Submit </button>
          <div>          
            <button type="button" 
            onClick={() => {
              setCountry(pickCountry())
              setAnswer('')
            }}
            > Next Country </button>
          </div>
        </form>
        {feedback && <p>{feedback}</p>}
      </div>  
    </div>
  )
}

function pickCountry(): string {
  const country = Object.keys(dictionary)
  const randomIndex = Math.floor(Math.random() * country.length)
  return country[randomIndex]
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
