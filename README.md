# Spotitweet

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

I created a Spotify clone with a Twitter feed. I used Nextjs and Tailwind for the UI, and nextauth for user auth flow. I called the Spotify Playlist to access a user’s playlists, the user’s top songs/artists, any album, and any artist info. Created a search component to replicate Spotify search functionality and a player component that lets you play, pause, skip, etc. a Spotify song on your device. I implemented the t3 stack to add features of posts that require a song a description and editable profiles. I used a MySQL database to create a typesafe relational database of posts, users, comments and likes that is interfaced by Prisma ORM and tRPC router handlers interface with Prisma models to perform CRUD operations on MySQL. I then used Nextjs API routes to call the tRPC API data and used Revalidation, caching helps keep data fresh.

