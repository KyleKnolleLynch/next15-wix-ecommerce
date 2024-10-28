import { createClient, OAuthStrategy } from "@wix/sdk";
import { env } from "./env";
import { NextRequest } from "next/server";
import { WIX_SESSION_COOKIE } from "./lib/constants";

const wixClient = createClient({
    auth: OAuthStrategy({clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID})
})

export async function middleware(request: NextRequest) {
    const cookies = request.cookies
    const sessionCookie = cookies.get(WIX_SESSION_COOKIE)


}

