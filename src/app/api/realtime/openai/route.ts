import {getSubscriptionToken} from "@inngest/realtime"
import {inngest} from "@/inngest/client"
import {NextResponse} from "next/server"
import {openAiChannel} from "@/inngest/channels/openai";

export async function POST() {
  try {
    const token = await getSubscriptionToken(inngest, {
      channel: openAiChannel(),
      topics: ["status"],
    })

    return NextResponse.json(token)
  } catch (error) {
    console.error("Failed to generate realtime token:", error)
    return NextResponse.json(
        {error: "Failed to generate token"},
        {status: 500}
    )
  }
}
