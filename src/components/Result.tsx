import { BowlingGame } from '../types'

function Result({game}:{game:BowlingGame}) {

  const total = game.frames.filter((frame) => frame.frameTotal!== null).at(-1)?.frameTotal
  return (
    <div className='bowling-result'>
        {total}
    </div>
  )
}

export default Result