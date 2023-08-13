import TopRightIcon from "~/components/layout/TopRightIcon";
import { PageLayout } from "~/components/layout/layout";
import Icon from "../../public/icon.png"
import NewTweet from "~/components/social/NewTweet";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session } = useSession();

const tabs = ["Recent", "Following"] as const
const [activeTab, setActiveTab] = useState<(typeof tabs[number])>('Recent')
  
  return (
    <> 
      <PageLayout>
        <TopRightIcon /> 
          <header className="pt-5 border-b space-y-3">
            <div className="flex space-x-4 pl-5">
            <h1 className="text-2xl font-extrabold mb-2">Spoti-Tweet Home</h1>
            <img src={Icon.src} alt=""  className="h-10 w-10"/>
            </div>

            {session && <div className="flex">{tabs.map(tab =>{
              return <div key={tab} className={`flex-grow p-2 text-slate-400 hover:bg-slate-800 text-center text-lg focus-visible:bg-slate-500 ${tab === activeTab ? " border-b-4  border-green-600 font-bold": ""}`}
              onClick={()=> setActiveTab(tab)}>{tab}</div>
            })}</div>}
           
          </header>
          {session && <NewTweet/>}
          {activeTab === "Recent" && <RecentTweets/>}
          {activeTab === "Following" && <FollowingTweets/>}

          
        </PageLayout>    
    </>
  );
}
import { api } from "~/utils/api";
import  AllTweetLists  from "~/components/social/AllTweetLists";
import {  useState } from "react";

const RecentTweets = () => {
  const tweets = api.tweet.allPosts.useInfiniteQuery({onlyFollowing: false}, {getNextPageParam: (lastPage) => lastPage.nextCursor});

  return <AllTweetLists tweets={tweets.data?.pages.flatMap(page => page.tweets)} 
  isError={tweets.isError}
  isLoading={tweets.isLoading}
  hasMore ={tweets.hasNextPage}
  fetchNewTweets ={tweets.fetchNextPage}/>;
  }

const FollowingTweets = () => {
  const tweets = api.tweet.allPosts.useInfiniteQuery({onlyFollowing: true}, {getNextPageParam: (lastPage) => lastPage.nextCursor});

  return <AllTweetLists tweets={tweets.data?.pages.flatMap(page => page.tweets)} 
  isError={tweets.isError}
  isLoading={tweets.isLoading}
  hasMore ={tweets.hasNextPage}
  fetchNewTweets ={tweets.fetchNextPage}/>;
  }
    