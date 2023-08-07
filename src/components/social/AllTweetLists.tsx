import React from 'react'
import Link from 'next/link'
import {BsFillPlayCircleFill} from 'react-icons/bs'
import { useRecoilState } from 'recoil'
import { currentTrackIdState } from '~/atom/songAtom'
import useSpodify from '~/hooks/useSpodify'
import { isPlayingState } from '~/atom/songAtom'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import {FaRegCommentDots} from 'react-icons/fa'
import { LoadingSpinner } from '../layout/Loading'


dayjs.extend(relativeTime);


type TweetsProps = {
    isLoading: boolean;
    isError: boolean;
    hasMore: boolean | undefined;
    fetchNewTweets: () => Promise<any>;
    tweets?: any[]
}

type Tweet = {
    id: string;
    content: string;
    createdAt: Date;
    likesCount: number;
    likedByMe: boolean;
    userId: string;
    user: {
        id: string;
        name: string | null;
        image: string |null;
        email: string | null;
    }
    trackId: string | null;
    trackImage: string | null;
    trackName: string | null;
    trackArtist: string | null;
    trackUri: string | null;
    artistId: string | null;
    albumId: string | null;
}

const AllTweetLists = ({tweets, isError, isLoading, fetchNewTweets, hasMore}: TweetsProps) => {
  const [currentTrack, setCurrentTrack] = useRecoilState<string| null>(currentTrackIdState)
  const spotify = useSpodify()
  const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState)
  

    if(isLoading) return <LoadingSpinner/>
    if(isError) return <div className='text-center'>Error   ... </div>
    if(!tweets || tweets.length === 0) return <div className='my-4 text-center text-2xl'>No Tweets</div>
  return (
    <div>
      {
            tweets.map(tweet => (
              <div key={tweet.id} className='border-b border-slate-400 p-4'>
              <div  className="flex lg:justify-between justify-start flex-col lg:flex-row  ">
                <div className='flex flex-col gap-2'>
                <div className='flex gap-3 items-center'>
                {tweet.user.image && <Link href={`/@${tweet.user.email}`}><img src={tweet.user.image} alt="author_pfp" className="rounded-full hover:scale-[1.03] hover:opacity-50 h-12 w-12" /></Link>}
              <div className="flex flex-col">
                <div className="flex gap-1">
                  <Link href={`/@${getEmailBody(tweet.user.email!)}`}><span className="font-bold text-slate-200 hover:border-b-2 ">{tweet.user.name}</span></Link>
                  <span className="text-slate-300">@{getEmailBody(tweet.user.email!)} ·</span>
                  <Link href={`/post/${tweet.id}`}> 
                  <span className="text-slate-300 hover:border-b text-xs md:text-base">{ dayjs(tweet.createdAt).fromNow()}</span></Link>
                </div>
                <Link href={`/post/${tweet.id}`}> <span className="text-xl w-full text-slate-500 lg:text-lg">{tweet.content}</span></Link>
                      </div>
                    </div>

                    <div className='flex justify-start  items-center pl-16 space-x-10  '>
                    <span className='flex gap-3 items-center'>
                      {tweet.likedByMe ? <AiFillHeart className='text-2xl text-red-500 hover:text-red-800 cursor-pointer'/>: <AiOutlineHeart className='text-2xl text-red-500 hover:text-red-800 cursor-pointer'/> }
                      {tweet.likesCount}
                      </span>
                    <span className='flex gap-3 items-center cursor-pointer '> <FaRegCommentDots className='text-2xl hover:text-slate-500'/> 5</span>
                      </div>
                    </div>
                  

                    <div className='flex items-center  justify-center p-5 space-x-5 hover:bg-slate-700 rounded-xl'>
                    {tweet.trackImage &&<img src={tweet.trackImage} alt="album cover" className='w-10 h-10 rounded-md'/>}
                    <div className='flex flex-col items-start'>
                      <Link href={`/albums/${tweet.albumId}`}>
                        <h1 className='text-sm font-semibold truncate w-36 hover:underline'>{tweet.trackName}</h1></Link>
                        <Link href={ `/artist/${tweet.artistId}`}>
                      <h1 className='text-xs hover:underline text-slate-400'>{tweet.trackArtist}</h1>
                      </Link>
                    </div>  
                    <button className='text-green-600 text-3xl'
                    onClick={()=>{
                      setCurrentTrack(tweet.trackId)
                      setIsPlaying(true)
                      spotify.play({
                      uris: [tweet.trackUri!]
                      })
                    }}><BsFillPlayCircleFill/></button>
                          </div>


                    </div>
                   
                    </div>
            ))
      }
    </div>
  )
}

function getEmailBody(email: string): string {
  const [body]  = email.split('@')
  if(body) return body
  return email
}

export default AllTweetLists
