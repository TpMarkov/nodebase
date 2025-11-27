import {channel, topic} from "@inngest/realtime"

export const googleFormChannel = channel("google-form-execution").addTopic(
    topic("status").type<{
      nodeId: string,
      status: "loading" | "success" | "error",
    }>(),
)