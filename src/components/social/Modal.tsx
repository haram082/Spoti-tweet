import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {AiOutlineClose} from 'react-icons/ai'
import useSpodify from '~/hooks/useSpodify';
import {HiOutlineMagnifyingGlass} from 'react-icons/hi2'    

 const Backdrop = ({children, onClick}) => {
  return (
    <motion.div
    className='absolute top-0 left-0 w-full h-full bg-lime-500 bg-opacity-50 z-50 flex justify-center items-center' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
    onClick={onClick}>
         {children}
    </motion.div>
  )
}

const dropIn = {
    hidden: {
        y: '-100vh',
        opacity: 0
    },
    visible: {
        y: '0',
        opacity: 1,
        transition: {
            type: 'spring',
            duration: 0.2, 
            damping: 20,
            stiffness: 100
        }
    },
    exit: {
        y: '100vh',
    }
}

type SongData = {
    trackId: string
    trackName: string
    trackArtist: string 
    trackImage: string 
    trackUri: string
    artistId: string
    albumId: string
}
type ModalProps = {
    handleClose: () => void
    setSongData: (data: SongData) => void
}

const Modal  = ({handleClose, setSongData}: ModalProps) => {
    const spotify = useSpodify()
    const [searchData, setSearchData] = useState<SpotifyApi.TrackObjectFull[] | null>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null)


    async function updateSearchResults(query: string){
        spotify.searchTracks(query, {limit: 4})
        .then((data) => {
            if (data.body.tracks) setSearchData(data.body.tracks.items)
        })
    }
    function getSongData(track: SpotifyApi.TrackObjectFull){
        const songData = {
            trackId: track.id,
            trackName: track.name,
            trackArtist: track.artists[0]!.name,
            trackImage: track.album.images[0]!.url,
            trackUri: track.uri,
            artistId: track.artists[0]!.id,
            albumId: track.album.id
        }
        setSongData(songData)
        handleClose()
    }

    return (
        <Backdrop onClick={handleClose}>
        <motion.div  className='margin-auto py-8 rounded-md flex flex-col items-center w-1/2 md:w-[500px]  h-[400px] bg-slate-900 text-slate-100'
        onClick={(e)=> e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit ">
            <AiOutlineClose className='absolute top-5 right-5 text-2xl cursor-pointer text-red-600 hover:bg-red-600 hover:text-slate-100' onClick={handleClose}/>
            <h1 className='text-2xl font-semibold pb-5'>Add Song</h1>
            <div className='flex items-center'>
            <span className='bg-slate-100 text-slate-900 rounded-lg p-3 flex'><input type="text" placeholder="Search for a song" className=' outline-none'
            value={inputValue} onChange={async (e) => {
                setInputValue(e.target.value)
                if (e.target.value === '') setSearchData(null)
                else await updateSearchResults(e.target.value)
            }} ref={inputRef}></input>
                <HiOutlineMagnifyingGlass className=' text-2xl'/></span>
            </div> 
            {
                searchData &&
                <div className='flex flex-col items-center mt-5'>
                    {
                        searchData.map((track: SpotifyApi.TrackObjectFull) => (
                            <div className='flex items-center justify-between w-full px-5 py-2 space-x-5' key={track.id}>
                                <img src={track.album.images[0]?.url} alt="album cover" className='w-8 h-8'/>
                                <div className='flex flex-col items-start'>
                                    <h1 className='text-sm font-semibold truncate w-40'>{track.name}</h1>
                                    <h1 className='text-xs'>{track.artists[0]?.name}</h1>
                                </div>  
                                <button type="button" className='bg-lime-500 text-slate-900 rounded-lg px-3 py-1 hover:bg-lime-600 hover:text-slate-100'
                                onClick={()=> getSongData(track)}>Add</button>

                            </div>
                        ))
                    }
                </div>
            }
            
            
        </motion.div>
        </Backdrop>
    )
    }

export default Modal