import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import { api } from "./routes/api.js";

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://127.0.0.1:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));

app.use("/api", api);
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Không tìm thấy API endpoint." });
});

const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Có lỗi hệ thống trong prototype."
  });
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`OpenCharity API running at http://127.0.0.1:${port}`);
    });
  })
  .catch((error) => {
    console.error("Cannot connect to MongoDB", error);
    process.exit(1);
  });
