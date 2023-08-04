import React from 'react'
import { useRecoilState } from 'recoil'
import useSpodify from '~/hooks/useSpodify'
import { useState } from 'react'
import { currentTrackIdState, isPlayingState } from '~/atom/songAtom'
import Link from 'next/link'
import {FaPlay} from 'react-icons/fa'
import { useRouter } from 'next/router'


const Song = (props: {order: number, track: any, album: boolean, albumName: string | null, albumImage: string |null}) => {
  const router = useRouter()
  const {id} = router.query
  const spotify = useSpodify()
  const [currentTrack, setCurrentTrack] = useRecoilState<any>(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const Trackid = props.album ? props.track.id : props.track.track.id
  const trackName = props.album ? props.track.name : props.track.track.name
  const trackArtists: any[] = props.album ? props.track.artists : props.track.track.artists
  const trackDuration = props.album ? props.track.duration_ms : props.track.track.duration_ms
  const uri = props.album ? props.track.uri : props.track.track.uri
  const albumId = props.album ? id : props.track.track.album.id
  const albumName = props.album ? props.albumName : props.track.track.album.name
  const trackImage = props.album ? props.albumImage ? props.albumImage: props.track.album.images[0].url : props.track.track.album.images[0].url
  



  const playSong = () => {
    setCurrentTrack(Trackid)
    setIsPlaying(true)
    spotify.play({
      uris: [uri]
    })
  }


  return (
    <div className={`grid grid-cols-2 text-gray-400  px-2 py-4 md:px-4  hover:bg-slate-800 hover:text-blue-400 rounded-lg ${Trackid === currentTrack && 'bg-slate-800'}`}
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)} >
      <div className='flex items-center space-x-4 '>

          <p onClick={playSong} className='cursor-pointer text-lg pr-2'>
          {isHovered ? <FaPlay  className="text-green-600" onClick={playSong} /> : props.order +1}</p>    
          <img src={trackImage} alt="" className='h-10 w-10'/>
          <div>
            <p className='text-xs md:text-base w-36 lg:w-64 text-slate-50'>{trackName}</p>
            <p className='w-40 text-xs md:text-base '>
                    { trackArtists.map((artist: any, i: number) => {
                                return (
                                    <>
                                        <Link href={`/artist/${artist.id}`}><span className='hover:underline text-sm'>{artist.name}</span></Link>
                                        <span>{i !=  trackArtists.length - 1 ? ", " : null}</span>
                                    </>
                                )
                            })
                        }</p>
        </div>
      </div>

      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <Link href={`/albums/${albumId}`}><p className='hidden md:inline text-sm w-40 hover:underline hover:font-semibold'>{albumName}</p></Link>
        <p className=' text-xs md:text-base mt-7 md:mt-0'>{time(trackDuration)}</p>
      </div>
    </div>
  )
}

function time(m: number) {
    const minutes: number = Math.floor(m / 60000);
    const seconds = Number(((m % 60000)/1000).toFixed(0));
    return seconds === 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

}


export default Song
