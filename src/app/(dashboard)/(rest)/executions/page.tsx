"use client"
import React, {useState} from 'react'
import {useTRPC} from "@/trpc/client";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";

const Page = () => {
  const trpc = useTRPC()
  const [data, setData] = useState({})
  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: (data) => {
      console.log(data)
      setData(data)
    }, onError: ({message}) => {
      toast.error(message)
    }
  }))

  return (
      <>
        <Button onClick={() => testAi.mutate()}>Execute AI</Button>
        <div className={"w-full"}>
          {data ? (<div>
            {JSON.stringify(data, null, 2)}
          </div>) : (<p>Still no data</p>)}
        </div>
      </>
  )
}
export default Page
