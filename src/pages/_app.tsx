import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Spoti-Tweet</title>
        <meta name="SpotiTweet" content="Integration between Twitter and Spotify" />
        <link rel="icon" href="/icon.png" />
        <script src="https://kit.fontawesome.com/ed688a6948.js" crossOrigin="anonymous" async></script>
      </Head>
      <Toaster />
      <Component {...pageProps} />
      
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
