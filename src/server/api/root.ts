import { userRouter } from "./routers/user";
import { createTRPCRouter } from "$/server/api/trpc";
import { travelRouter } from "./routers/travel";
import { groupRouter } from "./routers/groups/group";
import { groupMemberRouter } from "./routers/groups/groupMember";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  travel: travelRouter,
  user: userRouter,
  group: groupRouter,
  groupMember: groupMemberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
