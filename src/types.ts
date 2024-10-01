export type BowlingPoint = number | '/' | 'X' | '-' | null

export interface GameFrame
{
    points:BowlingPoint[],
    frameTotal:number|null,
    lastFrame?:boolean
}

export interface BowlingGame
{
    readonly id:number,
    player:string,
    frames:GameFrame[]
}