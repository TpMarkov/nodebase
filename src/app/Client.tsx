"use client"
import React from 'react'
import {useSuspenseQuery} from "@tanstack/react-query";
import {useTRPC} from "@/trpc/client";

const Client = () => {
    const trpc = useTRPC()
    const {data: users} = useSuspenseQuery(trpc.getUsers.queryOptions())
    return (
        <div>{JSON.stringify(users, null, 2)}</div>
    )
}
export default Client
