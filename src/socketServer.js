import { Server } from "socket.io";

const io = new serverHooks(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

export default io;
