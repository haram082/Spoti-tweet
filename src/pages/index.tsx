import { useSession } from "next-auth/react";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";
import AlbumView from "~/pages/playlist/[id]";


export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" }); 
  return (
    <> 
      <PageLayout>
          <div className=" flex-grow">
            Twitter stuff 
          </div>
        </PageLayout>    
    </>
  );
}


