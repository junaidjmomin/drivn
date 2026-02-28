import express from "express";
import { createServer as createViteServer } from "vite";
import apiHandler from "./api/index.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use the same API logic as Vercel
  app.use(apiHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DRIVN Local Dev Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
