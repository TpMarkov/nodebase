import React from 'react'
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {memo} from "react";

export const AddNodeButton = memo(() => {
  return (
      <Button onClick={() => {
      }}
              variant={"outline"}
              className={"bg-background"}
              size={"icon"}>
        <PlusIcon className={"size-4"}/>
      </Button>
  )
})

AddNodeButton.displayName = 'AddNodeButton'
