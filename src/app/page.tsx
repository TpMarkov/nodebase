import {getQueryClient, trpc} from "@/trpc/server"
import Client from "@/app/Client";
import {HydrationBoundary, dehydrate} from "@tanstack/react-query";
import {Suspense} from "react";

const Page = () => {
    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.getUsers.queryOptions())

    return <div className="min-h-screen w-full flex items-center justify-center">
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<p>Loading...</p>}>
                <Client/>
            </Suspense>
        </HydrationBoundary>
    </div>
}

export default Page