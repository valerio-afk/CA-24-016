import { useRef } from 'react'


function Player({name,onChange}:{name:string,onChange?:(player_name:string)=>void}) {

  const ref = useRef<HTMLDivElement>(null)

  const handleChanges = () =>{    
    onChange && onChange(ref.current?.innerText?.trim() || '')
  }
  return (
    <div ref={ref} className='bowling-player' contentEditable suppressContentEditableWarning onBlur={handleChanges}>
        {name}
    </div>
  )
}

export default Player