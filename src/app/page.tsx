import {requireAuth} from "@/lib/auth-utils";
import {caller} from "@/trpc/server";
import {LogoutButton} from "@/app/logoutButton";

const Page = async () => {
  await requireAuth()

  const data = await caller.getUsers()

  return <div className="min-h-screen w-full flex items-center justify-center">
    Protected Page
    <div>
      User: {JSON.stringify(data, null, 2)}
    </div>
    <LogoutButton/>
  </div>
}

export default Page