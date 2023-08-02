import { useSession } from "next-auth/react";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";


export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: session} = useSession();
  
  return (
    <>
      <PageLayout>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl">
            Main content
          </p>
        </div>
        </PageLayout>    
    </>
  );
}


