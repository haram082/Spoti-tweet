import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const ProfileRouter = createTRPCRouter({
 // create a new user in prisma if it doesn't exist
  createProfile: protectedProcedure
  .input(z.object({
    email: z.string().email(),
    image: z.string().url(),
    name: z.string().min(1),
  }))
  .mutation(async ({input: { email, image, name}, ctx}) => {
    const user = await ctx.prisma.user.create({data: { email, image, name, id: ctx.session.user.id}})
    return user
  }
  ),
  // get user by id
  getProfile: publicProcedure
  .query(async ({ ctx}) => {
    const user = await ctx.prisma.user.findUnique({where: {id: ctx.session?.user?.id}})
    return user
  }
  ),
  
});



export const TweetRouter = createTRPCRouter({

  /// Get all tweets
  allPosts: publicProcedure.input(
    z.object({
    limit: z.number().optional(), 
    cursor: z.object({id: z.string(), createdAt: z.date()}).optional()
  })).query(
    async ({input: {limit = 10, cursor}, ctx}) => {
      const currentUserId = ctx.session?.user?.id

      const tweets= await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
        select:{
          id: true,
          content: true, 
          createdAt: true,
          trackId: true,
          trackName: true,
          trackArtist: true,
          trackImage: true,
          trackUri: true,
          userId: true,
          albumId: true,
          artistId: true,
          _count: { select: { likes: true } },
          likes: currentUserId == null ? false : {where : {userId: currentUserId}},
          user: {select: {name: true, image: true, id: true, email: true}}
          
        }
      })
   
      let nextCursor: typeof cursor | undefined 
      if(tweets.length > limit){  
        const nextItem = tweets.pop()
        if(nextItem){
          nextCursor = {id: nextItem.id, createdAt: nextItem.createdAt}
        }
      }
      return {tweets: tweets.map((tweet)=>{
        return {
          ...tweet,
          likedByMe: tweet.likes?.length > 0,
          likesCount: tweet._count.likes
        } 
      }), nextCursor}
    }
  ),
    
  createTweet: protectedProcedure
  .input(z.object({
    content: z.string().min(1),
    trackId: z.string(),
    trackName: z.string(),
    trackImage: z.string(),
    trackArtist: z.string(),
    artistId: z.string(),
    albumId: z.string(),  
    trackUri: z.string(),
}))
  .mutation(async ({input: {content, trackId, trackName, trackArtist, trackImage, trackUri, albumId, artistId}, ctx}) => {
    const tweet = await ctx.prisma.tweet.create({data: { userId: ctx.session.user.id,content, trackId, trackName, trackArtist, trackImage, trackUri, albumId, artistId }
    })
    return tweet
  })
});
