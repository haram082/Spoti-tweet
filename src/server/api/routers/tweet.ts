import { Prisma } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  createTRPCContext,
} from "~/server/api/trpc";


export const TweetRouter = createTRPCRouter({

  /// Get all tweets
  allPosts: publicProcedure.input(
    z.object({
    limit: z.number().optional(), 
    onlyFollowing: z.boolean().optional(),
    cursor: z.object({id: z.string(), createdAt: z.date()}).optional()
  })).query(
    async ({input: {limit = 100, cursor, onlyFollowing= false}, ctx}) => {
      const currentUserId = ctx.session?.user?.id
      return await getInfiniteTweet({
        limit, ctx, cursor, whereClause: currentUserId == null || !onlyFollowing ? undefined : {user: {followers: {some: {id: currentUserId}}}} 
    })
  }
  ),

  /// Get all tweets by user
  allPostsByUser: publicProcedure.input(
    z.object({
    limit: z.number().optional(),
    userId: z.string(),
    cursor: z.object({id: z.string(), createdAt: z.date()}).optional()
  })).query(
    async ({input: {limit = 50, cursor, userId}, ctx}) => {
      return await getInfiniteTweet({
        limit, ctx, cursor, whereClause: {userId}
    })
  }
  ),
  //get one tweet
  getOneTweet: publicProcedure.input(z.object({id: z.string()})).query(
    async ({input: {id}, ctx}) => {
      const currentUserId = ctx.session?.user?.id
      const tweet = await ctx.prisma.tweet.findUnique({
        where: {id},
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
          _count: { select: { likes: true, comments: true } },
          likes: currentUserId == null ? false : {where : {userId: currentUserId}},
          user: {select: {name: true, image: true, id: true, username:true, email: true}},
          comments: {
            select: {
              tweetId: true,
              content: true,
              createdAt: true,
              userId: true,
              user: {select: {name: true, image: true, email: true, id: true, username:true}}
            }
          }
        }
      })
      if(!tweet){
        throw new Error("Tweet not found")
      }
      return {
        ...tweet,
        likedByMe: tweet.likes?.length > 0,
        likesCount: tweet._count.likes,
        commentCount: tweet._count.comments
      }
  }),
  


        
  // get all comments on a tweet
  getComments: publicProcedure.input(z.object({id: z.string()})).query(
    async ({input: {id}, ctx}) => {
      const tweet = await ctx.prisma.tweet.findUnique({
        where: {id},
        select:{
          id: true,
          userId: true,
          comments: {
            select: {
              tweetId: true,
              content: true,
              createdAt: true,
              userId: true,
              user: {select: {name: true, image: true, email: true, id: true, username:true}}
            }
          }
        },

      })
      if(!tweet){
        throw new Error("Tweet not found")
      }
      return tweet.comments
  }),


  // create comment route
  createComment: protectedProcedure
  .input(z.object({
    content: z.string().min(1),
    tweetId: z.string(),
}))
  .mutation(async ({input: {content, tweetId, }, ctx}) => {
    const comment = await ctx.prisma.comment.create({data: { userId: ctx.session.user.id, tweetId, content }
    })
    return comment
  }),
  

  // create tweet route
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
  }),

  //delete tweet route
  deleteTweet: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({input: {id}, ctx}) => {
    const tweet = await ctx.prisma.tweet.findUnique({where: {id}})
    if(!tweet){
      throw new Error("Tweet not found")
    }
    if(tweet.userId !== ctx.session.user.id){
      throw new Error("Not authorized")
    }
    await ctx.prisma.tweet.delete({where: {id}})
  }),


  // handle likes on post
  toggleLike: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({input: {id}, ctx}) => {
    const data = {userId: ctx.session.user.id, tweetId: id }
    const existingTLike = await ctx.prisma.like.findUnique({where: {userId_tweetId: data}})
    if(!existingTLike){
      await ctx.prisma.like.create({data})
    }else{
      await ctx.prisma.like.delete({where: {userId_tweetId: data}})  

    }

  })
});

async function getInfiniteTweet({
  whereClause, ctx, limit, cursor
}: {whereClause?: Prisma.TweetWhereInput, limit:number, cursor: {id: string, createdAt: Date} | undefined, ctx: inferAsyncReturnType<typeof createTRPCContext>}){
  const currentUserId = ctx.session?.user?.id

  const tweets= await ctx.prisma.tweet.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
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
      _count: { select: { likes: true, comments: true } },
      likes: currentUserId == null ? false : {where : {userId: currentUserId}},
      user: {select: {name: true, image: true, id: true, email: true, username:true}}
      
    }
  })

  let nextCursor: typeof cursor | undefined;
  if (tweets.length > limit) {
    const nextItem = tweets.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return {tweets: tweets.map((tweet)=>{
    return {
      ...tweet,
      likedByMe: tweet.likes?.length > 0,
      likesCount: tweet._count.likes,
      commentCount: tweet._count.comments
    } 
  }), nextCursor}
}
