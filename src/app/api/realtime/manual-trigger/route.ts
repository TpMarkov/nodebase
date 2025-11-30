import {getSubscriptionToken} from "@inngest/realtime"
import {inngest} from "@/inngest/client"
import {googleFormChannel} from "@/inngest/channels/google-form-channel"
import {NextResponse} from "next/server"
import {manualTriggerChannel} from "@/inngest/channels/manual-trigger";

export async function POST() {
  try {
    const token = await getSubscriptionToken(inngest, {
      channel: manualTriggerChannel(),
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
