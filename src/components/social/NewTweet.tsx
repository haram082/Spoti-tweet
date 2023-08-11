import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {LiaSpotify} from 'react-icons/lia'
import {IoIosCloseCircle} from 'react-icons/io'
import { motion } from 'framer-motion'
import SongModal from './SongsModal'
import { api } from '~/utils/api'
import { LoadingSpinner } from '../layout/Loading'


type SongData = {
  trackId: string
  trackName: string
  trackArtist: string 
  trackImage: string 
  trackUri: string
  artistId: string
  albumId: string
}

const NewTweet = () => {
const {data: session}= useSession()
const [input, setInput] = useState<string>('')
const [modalOpen, setModalOpen] = useState<boolean>(false)
const [songData, setSongData] = useState<SongData | null>(null)
const trpcUtils = api.useContext()
const {mutate, isLoading: isPosting} = api.tweet.createTweet.useMutation({
    onSuccess: (NewTweet)=> {
        console.log(NewTweet)
        setInput('')
        setSongData(null)
        void trpcUtils.tweet.allPosts.invalidate()
    },
    onError: (error)=> alert(error.message)
})
function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    console.log(input)
    if (!input || !songData) return
    mutate({content: input, trackId: songData.trackId, trackName: songData.trackName, trackArtist: songData.trackArtist, trackImage: songData.trackImage, trackUri: songData.trackUri, artistId: songData.artistId, albumId: songData.albumId});
    
}

 
return (
    <form className='flex flex-col border-b px-4  h-36' onSubmit={handleSubmit}>
        <div className='flex items-center lg:gap-4'>
        {session?.user?.image && <img src={session?.user?.image} alt="pfp"
        className="rounded-full object-contain h-14 w-14"></img>}

        <div className="flex flex-col flex-grow">

            <textarea className='bg-transparent text-slate-200 flex-grow overflow-hidden p-4 text-lg outline-none mb-1' placeholder="What's happening?" 
            value= {input} onChange={(e)=>setInput(e.target.value)} required
            ></textarea>

            <div className=' flex flex-row space-x-5'>
                    <motion.button type="button" className='w-32  h-9 border ml-3 rounded-2xl p-1 flex  justify-center items-center text-green-400 hover:scale-100 hover:bg-slate-800 active:bg-slate-800 active:scale-80'
                    onClick={()=> setModalOpen(!modalOpen)}>
                    {songData ? "Edit Song": "Add Song"}  <span className="pl-1 text-xl"><LiaSpotify/></span></motion.button>
                    {songData && 
                    <div className="flex border rounded-lg space-x-3 p-1 h-12 ">
                      {songData.trackImage &&<img src={songData.trackImage} alt="album cover" className="rounded-full h-8 w-8"></img>}
                          <div className='flex flex-col '>
                              <h2 className=' text-sm truncate w-36 '>{songData.trackName}</h2>
                              <h3 className='text-xs text-slate-500  '>{songData.trackArtist}</h3>
                          </div>
                          <button type="button" className='text-slate-500 hover:text-red-500 ' onClick={()=>setSongData(null)}><IoIosCloseCircle/></button>
                      </div>}
            </div>
                  {modalOpen && <SongModal handleClose={()=>setModalOpen(false)} setSongData={(res)=> setSongData(res)}/>}      
            </div>
            {!isPosting && <button type="submit" className={`text-base md:text-lg font-semibold ${input && songData ? "": " cursor-not-allowed hover:scale-100"}`} disabled={!input || !songData || isPosting}
           >Post</button>}
            {isPosting && <LoadingSpinner/>}
        </div>


    </form>
  )
}

export default NewTweet
