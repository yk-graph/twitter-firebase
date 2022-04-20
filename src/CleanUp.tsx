import React, { useEffect, useState, memo } from 'react'

type Props = {
  onCloseDisplay: () => void
}

const CleanUp: React.FC<Props> = ({ onCloseDisplay }) => {
  const [currentNum, setCurrentNum] = useState(0)

  const incrementNum = () => {
    console.log('incrementNum関数が呼ばれたで!')
    setCurrentNum((preNum) => preNum + 1)
  }

  useEffect(() => {
    console.log('useEffectが発火してCleanUpコンポーネント呼ばれたで!')
    window.addEventListener('mousedown', incrementNum)
    return () => {
      console.log('CleanUpコンポーネントが破棄されたで!')
      window.removeEventListener('mousedown', incrementNum)
    }
  }, [])

  console.log('CleanUpコンポーネント呼ばれたで!')

  return (
    <div
      style={{
        height: '200px',
        width: '100vw',
        background: 'orange',
        margin: '40px',
        padding: '40px',
      }}
    >
      {currentNum}
      <br />
      <br />
      <button onClick={() => onCloseDisplay()}>close Display</button>
    </div>
  )
}

export default memo(CleanUp)
