import { useState } from 'react'
import './App.css'
import dictionary from './Dictionary'

function App() {
  const [country, setCountry] = useState(pickCountry())
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [outOf, setOutOf] = useState(0)

  return (
    <div className="App">
      <div className="Centered Main">
        <h1> CapitalGuessr </h1>
        <h4> Guess the capital correctly </h4>
        <h3> Score: {score} / {outOf} </h3>
        <hr/>
        <h3> What is the capital of {country}? </h3>
        <form
          onSubmit={(event) => {
            event.preventDefault()
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
          <label> Put answer here </label>
          <input
          type="text"
          placeholder="Type answer here"
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
