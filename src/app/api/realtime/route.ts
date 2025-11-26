import { getSubscriptionToken } from "@inngest/realtime"
import { inngest } from "@/inngest/client"
import { httpRequestChannel } from "@/inngest/channels/http-request"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const token = await getSubscriptionToken(inngest, {
            channel: httpRequestChannel(),
            topics: ["status"],
        })

        return NextResponse.json(token)
    } catch (error) {
        console.error("Failed to generate realtime token:", error)
        return NextResponse.json(
            { error: "Failed to generate token" },
            { status: 500 }
        )
    }
}
