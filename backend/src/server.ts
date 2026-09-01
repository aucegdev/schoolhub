import http from "http";
import app from "./app";
import prisma from "./config/database";
import { initSocketServer } from "./config/socket";

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    const server = http.createServer(app);
    initSocketServer(server);

    server.listen(PORT, () => {
      console.log(`Server & WebSockets running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
