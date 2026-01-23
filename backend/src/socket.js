const { Server } = require("socket.io");
const Meeting = require("./models/Meeting.model");

module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // ================= JOIN MEETING =================
    socket.on("join-meeting", async ({ meetingID, user }) => {
      try {
        const meeting = await Meeting.findOne({ meetingID });
        if (!meeting) return;

        const alreadyJoined = meeting.joined.find(
          (p) => p.user.toString() === user._id,
        );

        if (!alreadyJoined) {
          meeting.joined.push({
            user: user._id,
            name: user.name,
          });
          await meeting.save();
        }

        socket.join(meetingID);

        // 🔥 Send updated joined list
        io.to(meetingID).emit("joined-update", meeting.joined);
      } catch (err) {
        console.error("join-meeting error:", err.message);
      }
    });

    // ================= LEAVE MEETING =================
    socket.on("leave-meeting", async ({ meetingID, userId }) => {
      try {
        const meeting = await Meeting.findOne({ meetingID });
        if (!meeting) return;

        // Remove user
        meeting.joined = meeting.joined.filter(
          (p) => p.user.toString() !== userId,
        );

        // 🔥 IF NO ONE LEFT → DELETE MEETING
        if (meeting.joined.length === 0) {
          await Meeting.deleteOne({ meetingID });
          console.log(`Meeting ${meetingID} deleted (last user left)`);
          return; // no need to emit
        }

        await meeting.save();

        socket.leave(meetingID);

        io.to(meetingID).emit("joined-update", meeting.joined);
      } catch (err) {
        console.error("leave-meeting error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
