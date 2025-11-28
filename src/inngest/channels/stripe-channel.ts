import { channel, topic } from "@inngest/realtime"

export const stripeChannel = channel("stripe-execution").addTopic(
    topic("status").type<{
        nodeId: string,
        status: "loading" | "success" | "error",
    }>(),
)
