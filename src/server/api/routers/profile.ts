import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const ProfileRouter = createTRPCRouter({
  //get user by id for intial creation if needed
  getById: protectedProcedure
  .query(async ({  ctx }) => {
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } })
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return user
  }),
  

 // create a new user in prisma if it doesn't exist
  createProfile: protectedProcedure
  .input(z.object({
    email: z.string().email(),
    image: z.string().url().optional(),
    name: z.string().min(1),
  }))
  .mutation(async ({input: { email, image, name}, ctx}) => {
    const user = await ctx.prisma.user.create({data: { email, image, name, id: ctx.session.user.id, bio: null, username: email.split('@')[0]}})
    return user
  }
  ),  

  // update user profile
  updateProfile: protectedProcedure
  .input(z.object({
    name: z.string().min(1),
    bio: z.string(),
    username: z.string().min(1),
  }))
  .mutation(async ({input: { name, bio, username }, ctx}) => {
    const user = await ctx.prisma.user.update({where: {id: ctx.session.user.id}, data: {name, bio, username}})
    return user
  }
  ),
  // get user by username
  getUserbyUsername: publicProcedure
  .input(z.object({ username: z.string() }))
  .query(async ({ input: { username }, ctx }) => {
    const currentUserId = ctx.session?.user?.id;
    const profile = await ctx.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        username: true,
        bio: true,
        createdAt: true,
        _count: { select: { followers: true, follows: true, tweets: true } },  
        followers:
          currentUserId == null
            ? undefined
            : { where: { id: currentUserId } },
      },
    });

    if (profile == null) return;

    return {
      id: profile.id,
      name: profile.name,
      image: profile.image,
      email: profile.email,
      username: profile.username,
      bio: profile.bio,
      createdAt: profile.createdAt,
      followersCount: profile._count.followers,
      followsCount: profile._count.follows,
      tweetsCount: profile._count.tweets,
      isFollowing: profile.followers?.length > 0,
    };
  }),
toggleFollow: protectedProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input: { userId }, ctx }) => {
    const currentUserId = ctx.session.user.id;
    const existingFollow = await ctx.prisma.user.findFirst({
      where: { id: userId, followers: { some: { id: currentUserId } } },
    });

    let addedFollow: boolean;
    if (existingFollow == null) {
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { followers: { connect: { id: currentUserId } } },
      });
      addedFollow = true;
    } else {
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { followers: { disconnect: { id: currentUserId } } },
      });
      addedFollow = false;  
    }
    return { addedFollow };
  }),
  
}); 