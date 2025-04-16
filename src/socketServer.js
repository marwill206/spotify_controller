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

socket.on("check playback state", async (token) => {
  try {
    if (!token) {
      console.error("no acces token");
      socket.emit("playback state", {error: "no acces"})
      return;
    }

    spotifyApi.setAccessToken(token);

    const playbackState = await spotifyApi.getMyCurrentPlaybackState();
    if (playbackState.body && playbackState.body.is_playing !== undefined) {
      socket.emit("playback state", {isPlaying: playbackState.body.is_playing});
    }else {
      socket.emit("playback state", {error: "no active playback"})
    }
  } catch (error) {
    console.error("Error checking playback state:", error.message);
  }
});

  socket.on("pause", async (token) => {
    try {
      if (!token) {
        console.error("No access token provided");
        return;
      }

      spotifyApi.setAccessToken(token);

      await spotifyApi.pause();
      console.log("Playback paused");
    } catch (error) {
      // Add the error parameter here
      console.error("Error pausing playback:", error.message); // Properly log the error
    }
  });

  socket.on("play", async (token) => {
    try {
      if (!token) {
        console.error("No access token provided");
        return;
      }

      spotifyApi.setAccessToken(token);

      await spotifyApi.play();
      console.log("Playback play");
    } catch (error) {
     
      console.error("Error pausing playback:", error.message);
    }
  });

  socket.on("next track", async (token) => {
    try {
      if (!token) {
        console.log("no token");
        return;
      }
      spotifyApi.setAccessToken(token);

      await spotifyApi.skipToNext();
      console.log("skipped track");
    } catch (error) {
      console.log("error skipping track");
    }
  });

  socket.on("previous track", async (token) => {
    try {
      if (!token) {
        console.log("no token");
        return;
      }
      spotifyApi.setAccessToken(token);

      await spotifyApi.skipToPrevious();
      console.log("previous track");
    } catch (error) {
      console.log("error skipping track");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export default io;
