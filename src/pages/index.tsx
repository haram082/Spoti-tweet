import { useSession } from "next-auth/react";
import { PageLayout } from "~/Components/layout";
import { api } from "~/utils/api";


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


