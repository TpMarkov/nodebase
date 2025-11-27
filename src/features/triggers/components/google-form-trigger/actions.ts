"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { googleFormChannel } from "@/inngest/channels/google-form-channel";
import { inngest } from "@/inngest/client";


export type GoogleFormToken = Realtime.Token<typeof googleFormChannel, ["status"]>


export async function fetchGoogleFormRealtimeToken(): Promise<GoogleFormToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: googleFormChannel(),
        topics: ["status"],
    })

    return token
}
