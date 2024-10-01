import { useRef } from 'react'
import { BowlingPoint, type GameFrame } from '../types'


function validateFirstRoll(input:string):BowlingPoint
{
    const num = parseInt(input,10)

    if ((input=='x') || (input=='X')) return 'X'
    else if ((input=='-') || (input=='0')) return '-'
    else if (!isNaN(num))
    {
        if (num<1) return '-'
        else if (num>9) return 'X'
        else return num
    }
    
    return null
}

function validateSecondRoll(input:string,prev_roll:BowlingPoint):BowlingPoint
{
    if (prev_roll !== null)
    {
        const num = parseInt(input,10)

        if (prev_roll != 'X') 
        {

            if ((input=='-') || (input=='0')) return '-'
            else if (input=='/') return '/'
            let prev_num = prev_roll == '-' ? 0 : prev_roll as number

            if ((prev_num + num) >= 10) return '/'
            else return num
        }
    }
        
    return null
}

function Frame(props:GameFrame & {onChange?:(roll:number,score:BowlingPoint)=>void}) {

  const refs = useRef<Array<HTMLDivElement|null>>([])

  const allowThirdRoll = () =>
    {
      return props.points[0] ==='X' || props.points[1] == '/'
    }
   

  const handleChange = (idx:number) =>{
    let value:BowlingPoint = null
    const elem = refs.current[idx]
    

    if (elem)
    {
        const input = elem.innerText.trim()

        if ((props.lastFrame === undefined) || (props.lastFrame === false))
        {

            if (idx==0) value = validateFirstRoll(input)
            else if (idx==1) value = validateSecondRoll(input, props.points[0])
        }
        else
        {
            switch (idx)
            {
                case 0: 
                    value=validateFirstRoll(input)
                    break
                case 1:
                    value = props.points[0] === 'X'?validateFirstRoll(input):validateSecondRoll(input, props.points[0])
                    break
                case 2:

                    value = allowThirdRoll()?validateFirstRoll(input):validateSecondRoll(input, props.points[1])
                    break

            }
        }

        elem.innerText = value?value.toString():''

        if (props.onChange && value)
        {
            props.onChange(idx,value)

            if (idx<(refs.current.length-1))
            {
                props.onChange(idx+1,null)
            }
        }
    }
  }

  



  
  return (
    <div className='bowling-frame'>
        <div className="frame-first-line">
            <div ref={el=>refs.current[0]=el} onInput={() => handleChange(0)} contentEditable suppressContentEditableWarning>
                {props.points[0] || '\u00A0'}
            </div>
            <div className='boxed' ref={el=>refs.current[1]=el} onInput={() => handleChange(1)} contentEditable suppressContentEditableWarning>
                {props.points[1] || '\u00A0'}
            </div >

            {
                props.lastFrame &&
                <div className='boxed' ref={el=>refs.current[2]=el} contentEditable={allowThirdRoll()} onInput={() => handleChange(2)} suppressContentEditableWarning>
                    {props.points[2] || '\u00A0'}
                </div>
            }
        </div>

        <div className="frame-second-line">
        {props.frameTotal !==null? props.frameTotal : '\u00A0'}
        </div>
    </div>
  )
}

export default Frame