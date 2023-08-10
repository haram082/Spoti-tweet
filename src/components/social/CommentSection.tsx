import React from 'react'
import { api } from '~/utils/api'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
                <img src={comment.user.image!} className='w-10 h-10 rounded-full'/>
                <div className='flex flex-col'>
                    <div className='flex items-center space-x-2'>
                        <span className='font-semibold text-slate-100'>{comment.user.name}</span>
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
