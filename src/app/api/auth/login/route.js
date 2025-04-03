import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export async function GET(req) {
  const state = Math.random().toString(36).substring(2, 15);
  const scopes = "user-read-private user-read-email";
  const authUrl = spotifyApi.createAuthorizeURL(scopes.split(" "), state);
  return new Response(JSON.stringify({ url: authUrl }), { status: 200 });
}
