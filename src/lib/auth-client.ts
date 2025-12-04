import {createAuthClient} from "better-auth/react"
import {polarClient} from "@polar-sh/better-auth"

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use window.location.origin or fallback to env var
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin
  }
  // Server-side: use env var or default
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    polarClient()
  ]
})