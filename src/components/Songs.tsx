import React from 'react'
import Song from './Song'

const Songs = (props: {playlist: any}) => {
 
  return (
    <div className='px-8 flex flex-col space-y-1 pb-12 mt-5'>
      {props.playlist?.tracks?.items?.map((track: any, i:number) => (
        <Song key={track.track.id} track={track} order={i} />
      ))}
    </div>
  )
}

export default Songs
