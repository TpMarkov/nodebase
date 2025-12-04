import { NodeType } from "@prisma/client";
import { NodeExecutor } from "@/features/executions/types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "@/features/executions/components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { geminiExecutor } from "@/features/executions/components/gemini/executor";
import { openAiExecutor } from "@/features/executions/components/openAI/executor";
import { discordExecutor } from "@/features/executions/components/discord/executor";
import { slackExecutor } from "@/features/executions/components/slack/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.ANTHROPIC]: manualTriggerExecutor,
  [NodeType.OPENAI]: openAiExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.SLACK]: slackExecutor,

}

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type]
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`)
  }


  return executor
}