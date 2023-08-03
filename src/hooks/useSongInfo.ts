import React from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atom/songAtom'
import useSpodify from './useSpodify'
import { useEffect, useState } from 'react'


const useSongInfo = () => {
    const spotify = useSpodify()
    const [currentTrack, setCurrentTrack] = useRecoilState<any>(currentTrackIdState)
    const [trackInfo, setTrackInfo] = useState<any>(null)

    useEffect(() => {
        const fetchTrackInfo = async () => {
            if (currentTrack) {
                const trackInfo = await spotify.getTrack(currentTrack)
                setTrackInfo(trackInfo.body)
            }
        }
        fetchTrackInfo()
    }, [currentTrack, spotify]) 

  return trackInfo
}

export default useSongInfo
