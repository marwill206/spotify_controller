import { Server } from "socket.io";
import SpotifyWebApi from "spotify-web-api-node";

const io = new Server(3001, { // Ensure "Server" is used here
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("pause", async (accessToken) => {
    try {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(accessToken);
      await spotifyApi.pause();
      console.log("Playback paused");
    } catch (error) {
      console.error("Error pausing playback:", error.message);
    }
  });

  socket.on("next track", () => {
    console.log("Next track");
  });

  socket.on("previous track", () => {
    console.log("Previous track");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export default io;
