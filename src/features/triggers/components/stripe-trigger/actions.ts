"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { stripeChannel } from "@/inngest/channels/stripe-channel";
import { inngest } from "@/inngest/client";


export type StripeToken = Realtime.Token<typeof stripeChannel, ["status"]>


export async function fetchStripeRealtimeToken(): Promise<StripeToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: stripeChannel(),
        topics: ["status"],
    })

    return token
}
