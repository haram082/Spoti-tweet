import React from 'react'
import type { NextPage } from 'next'
import {useRouter} from 'next/router'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { PageLayout } from '~/components/layout/layout'
import Head from 'next/head'
import { api } from '~/utils/api'
import BackArrow from '~/components/layout/BackArrow'
import TopRightIcon from '~/components/layout/TopRightIcon'
import { LoadingPage, LoadingSpinner } from '~/components/layout/Loading'
import AllTweetLists from '~/components/social/AllTweetLists'
import CommentSection from '~/components/social/CommentSection'



const Tweet: NextPage = () => {
    const {data: session}= useSession()
    const router = useRouter()
    const {Postid} = router.query
    const {data: tweet, isLoading, isError} = api.tweet.getOneTweet.useQuery({
        id: Postid as string
    })
    const trpcUtils = api.useContext()
    const [input, setInput] = useState('')
    const {mutate, isLoading: isMutating} = api.tweet.createComment.useMutation({
        onSuccess: () => {
            void trpcUtils.tweet.getComments.invalidate()
            setInput('')
        },
        onError: (err) => {
            console.log(err)
        }
    })
    if(isLoading){
      return <LoadingPage/>
    }
    if(!tweet){
      return <div>no data</div>
    }

    return (
        
       <PageLayout>
            <Head>
                <title>Tweet: @{tweet?.user.username}</title>
            </Head>
            <TopRightIcon/>
            <div className='mt-5 pl-5 space-y-2 border-b'>
            <BackArrow />

            <AllTweetLists tweets={[tweet]} 
            isError={isError}
            isLoading={isLoading}
            hasMore ={false}
            fetchNewTweets ={async ()=> null}
            />
            </div>

            {session &&<div className='flex items-center border-b px-4 space-x-5'>
            <img src={session.user?.image!} className='w-14 h-14 rounded-full'/>
             <textarea className='bg-transparent text-slate-200 flex-grow overflow-hidden p-4  outline-none mb-1 h-24 w-full ' placeholder='Tweet your reply...'
             value= {input} onChange={(e)=>setInput(e.target.value)} required/>
          {isMutating ? <LoadingSpinner/> : <button className={`text-lg text-slate-600 pr-5 py-2 font-semibold ${!input && " cursor-not-allowed hover:scale-100"}`} disabled={!input ||  isMutating}
          onClick={()=> mutate({content: input, tweetId: tweet.id })}>Comment</button>}
            </div>}

            <CommentSection id={tweet.id}/>

        
       </PageLayout>
  )
}

export default Tweet
