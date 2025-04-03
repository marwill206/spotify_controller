import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi();

export async function GET(req) {
  const cookieHeader = req.headers.get("cookie");
  let isAuthenticated = false;
  console.log("weird:", isAuthenticated);

  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => cookie.split("="))
    );

    const token = cookies["access_token"];

    if (token) {
      spotifyApi.setAccessToken(token);
      try {
        const me = await spotifyApi.getMe();
        isAuthenticated = !!me.body;
      } catch (error) {
        console.log("no validate token");
      }
    }
  }

  console.log("Authentication status:", isAuthenticated);

  return new Response(JSON.stringify({ authenticated: isAuthenticated }), {
    status: 200,
  });
}
