import TopRightIcon from "~/components/layout/TopRightIcon";
import { PageLayout } from "~/components/layout/layout";
import Icon from "../../public/icon.png"
import NewTweet from "~/components/social/NewTweet";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session } = useSession();
  const {data: getUser}= api.profile.getProfile.useQuery();
  const {mutate} = api.profile.createProfile.useMutation({
    onSuccess: (data)=> {
        console.log(data)
    }
})
let num =1
  useEffect(() => {
  if(session && !getUser) {
   const m = () => mutate({ name: session?.user?.name!, image: session?.user?.image!, email: session?.user?.email!, })
   m()
  }
}, [getUser])

  
  return (
    <> 
      <PageLayout>
        <TopRightIcon /> 
          <header className="p-5 border-b">
            <div className="flex space-x-4">
            <h1 className="text-2xl font-extrabold mb-2">Spoti-Tweet Home</h1>
            <img src={Icon.src} alt=""  className="h-10 w-10"/>
            </div>
           
          </header>
          {session && <NewTweet/>}
          <RecentTweets/>

          
        </PageLayout>    
    </>
  );
}
import { api } from "~/utils/api";
import  AllTweetLists  from "~/components/social/AllTweetLists";
import { useEffect } from "react";

const RecentTweets = () => {
  const tweets = api.tweet.allPosts.useInfiniteQuery({}, {getNextPageParam: (lastPage) => lastPage.nextCursor});

  return <AllTweetLists tweets={tweets.data?.pages.flatMap(page => page.tweets)} 
  isError={tweets.isError}
  isLoading={tweets.isLoading}
  hasMore ={tweets.hasNextPage}
  fetchNewTweets ={tweets.fetchNextPage}/>;
  }
