import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body["access_token"]; // Extract access token
    const refreshToken = data.body["refresh_token"];

    return new Response(null, {
      status: 302,
      headers: {
        "set-Cookie": [
          `access_token=${accessToken}; Path=/; HttpOnly; SameSite=Strict`,
          `refresh_token=${refreshToken}; Path=/; HttpOnly SameSite=Strict`,
        ],
        Location: "/",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
