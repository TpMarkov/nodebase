import React from 'react'
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {memo} from "react";
import {NodeSelector} from "@/components/node-selector";
import {useSuspenseWorkflow} from "@/features/workflows/hooks/use-workflows";
import {useState} from "react"

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);


  return (
      <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
        <Button onClick={() => {
        }}
                variant={"outline"}
                className={"bg-background"}
                size={"icon"}>
          <PlusIcon className={"size-4"}/>
        </Button>
      </NodeSelector>
  )
})

AddNodeButton.displayName = 'AddNodeButton'
