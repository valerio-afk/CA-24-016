import Frame from './Frame'
import Player from './Player'
import Result from './Result'
import { TiDelete } from "react-icons/ti";

import { BowlingGame, BowlingPoint, GameFrame } from '../types'


function calculateScore(game:BowlingGame)
{
    const getRawValue = (score:BowlingPoint):number => {
        if (score=='X') return 10
        else if (score == '-') return 0
        else if (score == null) return 0
        else return score as number
    }


    const addRoll = (idx:number) => {
        if (idx<(game.frames.length-1))
        {
            return game.frames[idx+1].points[0] !== null? getRawValue(game.frames[idx+1].points[0]):null
        }
        
        return 0
    }

    const addRolls = (idx:number) => {
        if (idx<(game.frames.length-1))
        {
            const roll1 = addRoll(idx)

            if (roll1 === null) return null

            let roll2 = null

            if (game.frames[idx+1].points[1] !== null)
            {
                if (game.frames[idx+1].points[1]!=='/') roll2=getRawValue(game.frames[idx+1].points[1])
                else return 10
            }
            else if (game.frames[idx+2].points[0] !== null) roll2=getRawValue(game.frames[idx+2].points[0])

            if (roll2 === null) return null
            else return roll1 + roll2    
        }
        
        return 0
    }

    const isFrameReady = (idx:number) =>
    {

        if (game.frames[idx].points.every(el=>el===null)) return false
        

        if (idx<(game.frames.length-1))
        {
            if ((game.frames[idx].points[1]==='/') && (addRoll(idx) === null)) return false
            if ((game.frames[idx].points[0]==='X') && (addRolls(idx) === null) ) return false
            if ((game.frames[idx].points[0]!=='X') && (game.frames[idx].points[1]===null)) return false
        }
        else
        {   
            const limit = game.frames[idx].points[0] =='X' || game.frames[idx].points[1] =='/' ? 3:2
            
            if ( game.frames[idx].points.slice(0,limit).some(el=>el===null) ) return false
        }

        return true
    }

    let cumsum = 0 
    
    
    for (let i in game.frames)
    {
        let idx = parseInt(i,10)
        
        if (isFrameReady(idx))
        {   
            if (idx < (game.frames.length-1))
            {
                game.frames[i].frameTotal = getRawValue(game.frames[i].points[0])

                if (game.frames[i].points[0]!='X')
                {
                    if (game.frames[i].points[1] == '/')
                    {
                        const nextRoll = addRoll(idx) as number

                        if (nextRoll !== null) game.frames[i].frameTotal = 10 + nextRoll
                    }
                    else game.frames[i].frameTotal += getRawValue(game.frames[i].points[1])
                }
                else
                {
                    const nextRolls = addRolls(idx) as number

                    if (nextRolls !== null) game.frames[i].frameTotal = 10 + nextRolls
                }
            }
            else
            {
                if (game.frames[i].points[1] == '/') game.frames[i].frameTotal = 10 + getRawValue(game.frames[i].points[2])
                else if (game.frames[i].points[2] == '/') game.frames[i].frameTotal = 10 + getRawValue(game.frames[i].points[0])
                else game.frames[i].frameTotal = game.frames[i].points.map((p:BowlingPoint)=>getRawValue(p)).reduce( (acc,val) => acc+val, 0 )
            }

            game.frames[i].frameTotal += cumsum
            cumsum = game.frames[i].frameTotal
        }
        else
        {
            game.frames[i].frameTotal=null
            break;
        }
    }

    return game
}


function Game({game,onChange,onRemove}:{game:BowlingGame,onChange?:(arg:BowlingGame)=>void,onRemove?:(arg:BowlingGame)=>void})  {

    const handleChangedPlayerName = (value:string) => {        
        if (onChange)
        {
            const new_game = {...game, player:value}

            onChange(new_game)
        }
    }

    const handleChangedScore = (frame:number, roll:number, score:BowlingPoint) => {
        if (onChange)
        {
            const new_game = {...game}
            new_game.frames[frame].points[roll] = score

            calculateScore(new_game)

            onChange(new_game)
        }
    }


  return (
    <article className='bowling-game'>
        <div className='bowling-game-padding'></div>
        <div className='bowling-game-container'>
            <div className='delete-button-container'>
                <button className='delete-button' onClick={()=>onRemove && onRemove(game)}><TiDelete /></button>
            </div>
            <Player name={game.player} onChange={handleChangedPlayerName} />
            
            {game.frames.map( (frame:GameFrame,idx:number) =>{
                return <Frame {...frame} key={idx} onChange={(roll,score) => handleChangedScore(idx,roll,score)}/>
            })}
            <Result game={game} />
        </div>
        <div className='bowling-game-padding'></div>
    </article>
  )
}

export default Game