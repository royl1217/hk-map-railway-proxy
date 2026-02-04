import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve style.json
app.get("/style.json", (req, res) => {
  res.sendFile(path.join(__dirname, "style.json"));
});

app.get("/hkmap/*", async (req, res) => {
  try {
    const target =
      "https://mapapi.geodata.gov.hk" + req.originalUrl.replace("/hkmap", "");

    const response = await fetch(target);

    if (!response.ok) {
      return res.status(response.status).send("Tile fetch failed");
    }

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", response.headers.get("Content-Type"));

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  }
});

app.get("/", (req, res) => {
  res.send("Fly.io HK GeoData Proxy is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
