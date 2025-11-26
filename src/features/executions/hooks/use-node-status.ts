import type { Realtime } from "@inngest/realtime"

import { useInngestSubscription } from "@inngest/realtime/hooks";

import { useEffect, useState } from "react";

import type { NodeStatus } from "@/components/react-flow/node-status-indicator";


interface UseNodeStatusOptions {
  nodeId: string
  channel: string
  topic: string
  refreshToken: () => Promise<Realtime.Subscribe.Token>
}

export function useNodeStatus({ nodeId, channel, topic, refreshToken }: UseNodeStatusOptions) {

  const [status, setStatus] = useState<NodeStatus>("initial")

  const { data, error } = useInngestSubscription({
    refreshToken,
    enabled: true
  })

  // Debug logging
  useEffect(() => {
    console.log('[useNodeStatus] Subscription state:', {
      nodeId,
      channel,
      topic,
      dataLength: data?.length,
      error
    })
  }, [data, error, nodeId, channel, topic])


  useEffect(() => {
    if (!data?.length) {
      console.log('[useNodeStatus] No data yet for node:', nodeId)
      return
    }

    console.log('[useNodeStatus] Received data:', data)

    //  Find latest message from this node

    const latestMessage = data
      .filter(
        (msg) =>
          msg.kind === "data" &&
          msg.channel === channel &&
          msg.topic === topic &&
          msg.data.nodeId === nodeId,
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (!latestMessage || latestMessage.kind !== "data") {
      console.log('[useNodeStatus] No matching message found for node:', nodeId)
      return;
    }

    console.log('[useNodeStatus] Setting status:', latestMessage.data.status, 'for node:', nodeId)
    setStatus(latestMessage.data.status as NodeStatus);

  }, [data, nodeId, channel, topic]);


  return status

}