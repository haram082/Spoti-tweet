import React, { useCallback, useEffect, useState } from 'react'
import useSpodify from '~/hooks/useSpodify'
import { useRecoilState } from 'recoil'
import { currentTrackIdState } from '~/atom/songAtom'
import { isPlayingState } from '~/atom/songAtom'
import { useSession } from 'next-auth/react'
import useSongInfo from '~/hooks/useSongInfo'
import {IoPlayCircleSharp} from 'react-icons/io5'
import {IoPlaySkipForwardSharp} from 'react-icons/io5'
import {IoPlaySkipBackSharp} from 'react-icons/io5'
import {FaCirclePause} from 'react-icons/fa6'
import {FaShuffle} from 'react-icons/fa6'
import {FiRepeat} from 'react-icons/fi'
import {ImVolumeMedium} from 'react-icons/im'
import {ImVolumeMute2} from 'react-icons/im'
import { debounce } from 'lodash'



const Player = () => {
    const spotify = useSpodify()
    const {data: session} = useSession()
    const [currentTrack, setCurrentTrack] = useRecoilState<any>(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState)
    const [volume, setVolume] = useState<number>(50)
    const [repeat, setRepeat] = useState<boolean>(false)
    const [shuffle, setShuffle] = useState<boolean>(false)

    const songInfo = useSongInfo()

    useEffect(() => {
        if(spotify.getAccessToken() && !currentTrack){
            if(!songInfo){
                spotify.getMyCurrentPlayingTrack().then((data) => {
                    setCurrentTrack(data.body?.item?.id)  
                    setIsPlaying(data.body?.is_playing)
                })
            }
            setVolume(50)
        }
    }, [spotify, session, currentTrackIdState])

    useEffect(() => {
      if(volume >=0 && volume < 100){
        debouncedAdjustVolume(volume)
      }
    }, [volume])

    const debouncedAdjustVolume = useCallback(
      debounce((volume: number) => {
        spotify.setVolume(volume)
      }, 500)
      , [])

    const handlePlayPause = () => {
        spotify.getMyCurrentPlaybackState().then((data) => {
            if(data.body?.is_playing){
                spotify.pause()
                setIsPlaying(false)
            } else {
                spotify.play()
                setIsPlaying(true)
            }
        })
    }


  
  return (
    <div className='absolute w-screen bottom-0 bg-gradient-to-b from-slate-950 to-slate-800 h-20 text-slate-200 grid grid-cols-3 items-center text-xs md:text-base px-2 md:px-6 z-20'>
      <div className='flex items-center space-x-4'>
        <img src={songInfo?.album.images?.[0]?.url} alt="" className='inline h-16 w-16 p-2' />
        <div >
            <h3 className='font-semibold text-slate-200 hover:underline'>{songInfo?.name}</h3>
            <span className='text-slate-400 hover:underline hover:text-slate-200'>{songInfo?.artists?.[0]?.name}</span>
        </div>
      </div>


      <div className='space-x-4 md:space-x-6 flex justify-center'>

        <button>
            <FaShuffle className={`inline h-4 w-4 md:h-6 md:w-6 ${shuffle && 'text-green-500'}` } onClick={()=>{spotify.setShuffle(!shuffle); setShuffle(!shuffle)}}/>
        </button>

        <button className='hover:text-slate-100'>
            <IoPlaySkipBackSharp className='inline  h-4 w-4 md:h-7 md:w-7' onClick={()=>{
                spotify.skipToPrevious()
                setTimeout(() => {
                    spotify.getMyCurrentPlayingTrack().then((data) => {
                      setCurrentTrack(data.body?.item?.id)  
                    })
                  }, 2000)
                  }}/>
        </button>

        <button className='text-slate-200' onClick={handlePlayPause}>
            {isPlaying ? <FaCirclePause className='inline  h-5 w-5 md:h-10 md:w-10' /> : <IoPlayCircleSharp className='inline h-10 w-10' />}
        </button>

        <button className='hover:text-slate-100'>
            <IoPlaySkipForwardSharp className='inline h-4 w-4 md:h-7 md:w-7' onClick={()=>{
                spotify.skipToNext()
                setTimeout(() => {
                    spotify.getMyCurrentPlayingTrack().then((data) => {
                      setCurrentTrack(data.body?.item?.id)  
                    })
                  }, 2000)
                  }}/>
        </button>

        <button>
            <FiRepeat className={`inline h-4 w-4 md:h-6 md:w-6 ${repeat && 'text-green-500'}` } onClick={()=>{
                if(!repeat){
                spotify.setRepeat('track')
                } else {
                spotify.setRepeat('off')}
                setRepeat(!repeat)}
                }/>
        </button>
        </div>

      <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
        <button>
        {/* volume control only works with laptop active device for some reason */}
        {volume > 0 ?
            <ImVolumeMedium className='inline h-5 w-5 md:h-6 md:w-6' 
            onClick={()=>{ setVolume(0)}}/>
            :
            <ImVolumeMute2 className='inline h-5 w-5 md:h-6 md:w-6'
            onClick={()=>{setVolume(50)}}/>}
            </button>
            <input type="range" value={volume} min={0} max={100}
            onChange={(e)=>setVolume(Number(e.target.value))}
              className='w-14 md:w-28'
            />
      </div>
    </div>
  )
}

export default Player
