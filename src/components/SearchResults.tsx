import React from 'react'
import AlbumView from './AlbumView'
import Songs from './Songs'
import useSpodify from '~/hooks/useSpodify'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '~/atom/songAtom'
import { useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import Link from 'next/link'

const SearchResults = (props:{playlists: any, songs: any, artists:any, albums:any }) => {
    const {playlists, songs, artists, albums} = props
    const spotify = useSpodify()
    const [currentTrack, setCurrentTrack] = useRecoilState<any>(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    
  return (
    <div className='flex flex-col ml-5'>
      
        <div className=' text-2xl font-bold mb-2 p-2 text-slate-200'>Songs</div>
        {
        
            songs.map((song: any, i: number) => {
                return(
                <div className={`grid grid-cols-2 text-gray-400  px-2 py-4 md:px-4 mb-3 hover:bg-slate-800 hover:text-blue-400 rounded-lg ${song.id === currentTrack && 'bg-slate-800'}`} >
                  <div className='flex items-center space-x-4 '>
            
                      <button onClick={()=>{
                        setCurrentTrack(song.id)
                        setIsPlaying(true)
                        spotify.play({
                        uris: [song.uri]
                        })
                      }} className='cursor-pointer text-lg pr-2'>
                       <FaPlay  className="text-green-900 hover:text-green-600" /></button>    
                      <img src={song?.album.images?.[0]?.url} alt="" className='h-10 w-10'/>
                      <div>
                        <p className='text-xs md:text-base w-36 lg:w-64 text-slate-50'>{song.name}</p>
                        <p className='w-40 text-xs md:text-base '>
                                { song.artists.map((artist: any, i: number) => {
                                            return (
                                                <>
                                                    <Link href={`/artist/${artist.name}`}><span className='hover:underline text-sm'>{artist.name}</span></Link>
                                                    <span>{i !=  song.artists.length - 1 ? ", " : null}</span>
                                                </>
                                            )
                                        })
                                    }</p>
                    </div>
                  </div>
                    <div className=' text-xs md:text-base mr-5 flex justify-end'>3:00</div>
                </div>)
                
        })
    }
    


        <div className=' text-2xl font-bold mb-2 p-2 text-slate-200'>Playlists</div>
        <div className='flex flex-wrap justify-evenly'>
            {
                playlists.map((playlist:any) => (
                    <AlbumView playlist={playlist}/>
                ))
            }
            </div>

        <div className='text-2xl font-bold mb-2 p-2 text-slate-200'>Artists</div>
        <div className='flex flex-wrap justify-evenly'>
            {
                artists.map((artist:any) => (
                    <Link href={`/artist/${artist.id}`} className='flex flex-col p-5 shadow border rounded-lg gap-3 hover:bg-gray-900'>
                        <img src={artist?.images?.[0]?.url} alt={artist.name} className='h-40 w-40 rounded-full'/>
                        <p className='text-slate-50 text-center hover:underline font-bold'>{artist.name}</p>
                    </Link>
                ))
            }
            </div>

        <div className='text-2xl font-bold mb-2 p-2 text-slate-200'>Albums</div>
        <div className='flex flex-wrap justify-evenly'>
            {
                albums.map((playlist:any) => (
                    <AlbumView playlist={playlist}/>
                ))
            }
            </div>
    </div>
  )
}

export default SearchResults
