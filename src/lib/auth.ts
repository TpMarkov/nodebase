import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import {polar, checkout, portal} from "@polar-sh/better-auth"
import {polarClient} from "./polar"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",

  }), emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  }, plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "d0723c7d-c9b0-4330-8a21-1002b5c0d801",
              slug: "Nodebase Pro"
            }
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true
        }), portal()
      ]
    })
  ]
})