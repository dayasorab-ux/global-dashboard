const http = require("http");
const fs = require("fs");
require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

function send(res, file, type) {
  res.writeHead(200, { "Content-Type": type });
  res.end(fs.readFileSync(file));
}

const server = http.createServer(async (req, res) => {
  try {
    // STATIC FILES
    if (req.url === "/") return send(res, "index.html", "text/html");
    if (req.url === "/style.css") return send(res, "style.css", "text/css");
    if (req.url === "/script.js") return send(res, "script.js", "application/javascript");

    // WEATHER
    if (req.url.startsWith("/weather")) {
      const u = new URL(req.url, "http://x");

      const lat = u.searchParams.get("lat");
      const lon = u.searchParams.get("lon");

      const r = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_KEY}`
      );

      const data = await r.text();

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(data);
    }

    // AI SUMMARY
    if (req.method === "POST" && req.url === "/ai") {
      let body = "";

      req.on("data", c => body += c);

      req.on("end", async () => {
        const { lat, lon } = JSON.parse(body);

        const prompt =
          `Give a short summary for coordinates (${lat}, ${lon}) ` +
          `including weather impact, geopolitics, economy and significance.`;

        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: prompt }]
              }]
            })
          }
        );

        const data = await r.json();

        const result =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No AI response";

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ result }));
      });

      return;
    }

    res.writeHead(404);
    res.end("Not Found");

  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end("Server Error");
  }
});

server.listen(process.env.PORT || 8001, () => {
  console.log("🚀 http://localhost:8001");
});