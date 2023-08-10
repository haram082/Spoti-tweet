import React, { useEffect, useState } from 'react'
import { PageLayout } from '~/components/layout/layout'
import type {NextPage} from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import TopRightIcon from '~/components/layout/TopRightIcon'
import BackArrow from '~/components/layout/BackArrow'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'
import { LoadingPage } from '~/components/layout/Loading'
import { shuffle } from 'lodash';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {FaRegCalendarAlt} from 'react-icons/fa'
import AllTweetLists from '~/components/social/AllTweetLists'
import { ProfileModal } from '~/components/social/ProfileModal'




dayjs.extend(relativeTime);
const colors: string[] = [
  "from-blue-500",
  "from-lightBlue-500",
  "from-cyan-500",
  "from-emerald-500",
  "from-teal-500",
  "from-green-500",
  "from-lime-500",
  "from-yellow-500",
  "from-amber-500",
  "from-orange-500",
  "from-red-500",
  "from-pink-500",        
  "from-purple-500"
  ];


const Profile: NextPage = () => {
  const router = useRouter()
  const {slug} = router.query
  const name = typeof slug === "string" ? slug.replace("@", ""): ""
  const {data: userInfo, isLoading} = api.profile.getUserbyUsername.useQuery({username: name})
  const {data: session} = useSession()
  const tweets = api.tweet.allPostsByUser.useInfiniteQuery({userId: userInfo?.id!}, {getNextPageParam: (lastPage) => lastPage.nextCursor})
  const trpcUtils = api.useContext()
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: () => {
      void trpcUtils.profile.getUserbyUsername.invalidate()
    }
  })  

  const [color, setColor] = useState("from-green-100");
  useEffect(() => {
      // @ts-ignore
      setColor(shuffle(colors).pop())
        }, []);
    const [modalOpen, setIsModalOpen] = useState(false)

  
  if(isLoading){
    return <PageLayout><LoadingPage/></PageLayout>
  }
  if(!userInfo){
    return <PageLayout>No Data</PageLayout>
  }
  return (
    <>
      <Head>
        <title>{slug}</title>
      </Head>
      <PageLayout>
        <TopRightIcon/>
        <div className={`h-[200px] bg-gradient-to-b to-black ${color} relative pt-5 pl-5`}>
          <BackArrow/>
            {userInfo.image &&<img src ={userInfo.image} alt= {`${name}pfp`}
            width ={96} height={96}
              className="rounded-full absolute bottom-0 left-0 ml-4 -mb-[48px] border-2"
            />}
        </div>
        <div className="relative">
          {userInfo.id === session?.user?.id ? <button className="p-2 px-3 text-l text-slate-300 hover:bg-green-400 hover:text-stone-800 transition duration-200 absolute right-3  top-3 border rounded-lg border-slate-600 hover:scale-95"
          onClick={() => setIsModalOpen(!modalOpen)}>Edit Profile</button> :
          <button className="p-2 px-3 text-l text-slate-300 hover:bg-green-400 hover:text-stone-800 transition duration-200 absolute right-3  top-3 border rounded-lg border-slate-600 hover:scale-95"
          onClick={()=>toggleFollow.mutate({userId: userInfo.id})}
          disabled={toggleFollow.isLoading}>{userInfo?.isFollowing ? "Unfollow" : "Follow +"}</button>}
          

          <div className="h-[64px]"></div>
          <div className="p-4 pb-0 text-2xl font-bold">{userInfo.name}</div>
          <div className="p-4 pt-0 text-l text-slate-300">@{userInfo.username}</div>
          <div className="p-4 pt-0 text-l text-slate-300 flex space-x-3 items-center"> <FaRegCalendarAlt/><span>Joined {dayjs(userInfo.createdAt).format("MMM D, YYYY")}</span> </div>
          <div className="p-4 pt-0 text-l text-slate-300">{userInfo.bio ? userInfo.bio : ''}</div>
          <div className='flex space-x-6 px-3 pb-3'>
            <div><span className='font-bold text-lg'>{userInfo.followersCount}</span>  {userInfo.followersCount === 1 ? "Follower" :"Followers"}</div>
            <div><span className='font-bold text-lg'>{userInfo.followsCount}</span> Following</div>
          </div>
          <div className="w-full border-b border-slate-400"></div>
        </div>
        <AllTweetLists tweets={tweets.data?.pages.flatMap(page => page.tweets)} 
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore ={tweets.hasNextPage}
      fetchNewTweets ={tweets.fetchNextPage}/>
        {modalOpen && <ProfileModal setIsOpen={setIsModalOpen} currentName={userInfo.name!} currentUsername={name} currentBio={userInfo.bio}/>}
      </PageLayout>
      
    </>
  );
}


export default Profile


