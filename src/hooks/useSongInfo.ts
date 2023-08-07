import { useRecoilState } from 'recoil'
import { currentTrackIdState } from '../atom/songAtom'
import useSpodify from './useSpodify'
import { useEffect, useState } from 'react'


const useSongInfo = () => {
    const spotify = useSpodify()
    const [currentTrack, setCurrentTrack] = useRecoilState<string |null>(currentTrackIdState)
    const [trackInfo, setTrackInfo] = useState<SpotifyApi.SingleTrackResponse| null>(null)

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
