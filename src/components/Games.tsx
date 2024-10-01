import Game from './Game'
import { BowlingGame } from '../types'
import { useState } from 'react'

function Games() {
  
    const defaultGame:BowlingGame =
    {
        id:0,
        player: "Player",
        frames: [
            {points:[null,null], frameTotal:null},
            {points:[null,null], frameTotal:null},
            {points:[null,null], frameTotal:null},
            {points:[null,null], frameTotal:null},
            {points:[null,null], frameTotal:null},
            {points:[null,null], frameTotal:null},
            {points:[null,null], frameTotal:null},
            {points:[null,null], frameTotal:null},
            {points:[null,null], frameTotal:null},
            {points:[null,null,null], frameTotal:null, lastFrame:true},
        ]
           
    }

    const [games,setGames] = useState([defaultGame])

    const handleChanges = (game:BowlingGame) =>
    {
        const new_games = games.map((g:BowlingGame) => g.id===game.id?game:g)        
        setGames(new_games)
    }

    const handleRemove = (game:BowlingGame) => {
        const new_games = games.filter ((g:BowlingGame) => g.id !== game.id)
        setGames(new_games)
    }

    const addGame = () => {
        const id = games.length > 0 ? (games.at(-1) as BowlingGame).id +1 : 0
        const new_game = {...JSON.parse(JSON.stringify(defaultGame)), id: id};
        const new_games = [...games, new_game]
        setGames(new_games)

    }

  return (
    <section className='bowling-games-container'>
        <div className='bowling-games-list'>
            {
                games.map((game:BowlingGame,idx:number)=>{
                    return <Game key={idx} game={game} onChange={handleChanges} onRemove={handleRemove}/>
                })
            }
        </div>

        <button onClick={addGame}>Add game</button>
    </section>
  )
}

export default Games