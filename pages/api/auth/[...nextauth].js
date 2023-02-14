import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyAPI, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
    try {
        spotifyAPI.setAccessToken(token.accessToken);
        spotifyAPI.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyAPI.refreshAccessToken();
        console.log("refreshed token is : ", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires : Date.now()+refreshedToken.expires_in * 1000, // = 1 hr as 3600 is returned from spotify API
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken // Replace if new one came back elese fall back to old refresh token
        }
    }
    catch(error) {
        console.log(error);
        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}

export default NextAuth ({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL
        })
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({token, account, user}) {
            // for initial sign in
            if(account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    // we are handling expiry times in Milliseconds hence * 1000
                    accessTokenExpires: account.expires_at * 1000
                }
            }
            // Return previous token if the access token has not expired yet
            if(Date.now() < token.accessTokenExpires) {
                console.log("Access token still valid");
                return token;
            }
            // If the access token expires after an hour, so we need to refresh it
            console.log("access token has expired, refreshing...");
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session;
        }
    }
});
