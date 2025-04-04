import { Server } from "socket.io";
import SpotifyWebApi from "spotify-web-api-node";

const io = new Server(3002, {
  cors: {
    origin: "*",
  },
});

const spotifyApi = new SpotifyWebApi();

io.on("connection", (socket) => {
  console.log("A user connected");
  
  socket.on("pause", async (token) => {
    try {
      if (!token) {
        console.error("No access token provided");
        return;
      }
  
      spotifyApi.setAccessToken(token);
  
      await spotifyApi.pause();
      console.log("Playback paused");
    } catch (error) { // Add the error parameter here
      console.error("Error pausing playback:", error.message); // Properly log the error
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
