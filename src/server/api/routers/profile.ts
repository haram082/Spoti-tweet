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