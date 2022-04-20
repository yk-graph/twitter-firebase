import React, { useEffect, useState } from 'react'
import { Counter } from './features/counter/Counter'
import './App.css'

const App: React.FC = () => {
  const [status, setStatus] = useState<string | number>('tset')
  const [input, setInput] = useState('')
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    console.log('Appコンポーネント呼ばれたで!')
  }, [counter])

  return (
    <div className="App">
      <header className="App-header">
        <h4>{status}</h4>
        <button onClick={() => setStatus(1)}>Button</button>
        <h4>{input}</h4>
        <input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
        <h4>{counter}</h4>
        <button onClick={() => setCounter((preCounter) => preCounter + 1)}>
          add
        </button>
        <hr />
        <Counter />
      </header>
    </div>
  )
}

export default App
