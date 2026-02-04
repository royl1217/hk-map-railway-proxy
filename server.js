import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy HK GeoData vector tiles
app.get("/hkmap/*", async (req, res) => {
  try {
    const targetUrl =
      "https://mapapi.geodata.gov.hk" + req.originalUrl.replace("/hkmap", "");

    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res.status(response.status).send("Tile fetch failed");
    }

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", "application/x-protobuf");

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Railway HK GeoData Proxy is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
