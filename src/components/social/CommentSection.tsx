import React from 'react'
import { api } from '~/utils/api'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from 'next/link';

dayjs.extend(relativeTime);

const CommentSection = (props: {id: string}) => {
    const {data: comments, isLoading, isError} = api.tweet.getComments.useQuery({
        id: props.id
    })
    if(isLoading){
        return <div>loading</div>
    }
    if(isError){
        return <div>error</div>
    }
  return (
    <div className='space-y-2'>
        {comments?.map((comment, i) => (
            <div className='flex items-center space-x-3 border-b p-5' key={i}>
                <Link href={`@${comment.user.username}`}>
                <img src={comment.user.image!} className='w-10 h-10 rounded-full hover:scale-[1.03] hover:opacity-50 object-contain'/></Link>
                <div className='flex flex-col'>
                    <div className='flex items-center space-x-2'>
                    <Link href={`@${comment.user.username}`}><span className="font-bold text-xs md:text-base text-slate-200 hover:border-b-2 ">{comment.user.name}</span></Link>
                  <span className="text-slate-300 text-xs md:text-base">@{comment.user.username } ·</span>
                        <span className='text-slate-400 text-sm'>{dayjs(comment.createdAt).fromNow()}</span>
                    </div>
                    <div className='text-slate-200'>{comment.content}</div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CommentSection
