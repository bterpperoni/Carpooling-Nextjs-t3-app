import { userRouter } from "./routers/user";
import { createTRPCRouter } from "$/server/api/trpc";
import { rideRouter } from "./routers/ride/ride";
import { groupRouter } from "./routers/group/group";
import { groupMemberRouter } from "./routers/group/groupMember";
import { walletRouter } from "./routers/wallet/wallet";
import { transactionRouter } from "./routers/wallet/transaction";
import { paypalRouter } from "./routers/wallet/paypal";
import { bookingRouter } from "./routers/ride/booking";
import { notificationRouter } from "./routers/notification";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ride: rideRouter,
  booking: bookingRouter,
  user: userRouter,
  group: groupRouter,
  groupMember: groupMemberRouter,
  wallet: walletRouter,
  transaction: transactionRouter,
  paypal: paypalRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
