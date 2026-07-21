import app from "./app";
import prisma from "./config/database";

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
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
