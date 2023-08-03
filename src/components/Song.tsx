import React from 'react'
import { useRecoilState } from 'recoil'
import useSpodify from '~/hooks/useSpodify'
import { currentTrackIdState, isPlayingState } from '~/atom/songAtom'

const Song = (props: {order: number, track: any}) => {
  const spotify = useSpodify()
  const [currentTrack, setCurrentTrack] = useRecoilState<any>(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState)

  const playSong = () => {
    setCurrentTrack(props.track.track.id)
    setIsPlaying(true)
    spotify.play({
      uris: [props.track.track.uri]
    })
  }
  return (
    <div className='grid grid-cols-2 text-gray-400 py-4 px-4  hover:bg-slate-800 rounded-lg cursor-pointer' onClick={playSong}>
      <div className='flex items-center space-x-4 '>
        <p>{props.order +1}</p>
        <img src={props.track.track.album.images[0].url} alt="" className='h-10 w-10'/>
        <div>
            <p className='w-36 lg:w-64  text-slate-50'>{props.track.track.name}</p>
            <p className='w-40 '>{props.track.track.artists[0].name}</p>
        </div>
      </div>

      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <p className='hidden md:inline text-sm w-40 '>{props.track.track.album.name}</p>
        <p className='mt-7 md:mt-0'>{time(props.track.track.duration_ms)}</p>
      </div>
    </div>
  )
}

function time(m: number) {
    const minutes: number = Math.floor(m / 60000);
    const seconds: number = Number(((m % 60000)/1000).toFixed(0));
    return seconds === 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

}


export default Song
