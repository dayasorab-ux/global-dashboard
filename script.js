// script.js
// 2D MAP + 3D GLOBE + NEWS + STOCK + WEATHER + AI

let is3D = false;
let globe = null;

const info = document.getElementById("info");

// ==========================================
// MAP INIT
// ==========================================
const map = L.map("map").setView([20, 0], 2);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { maxZoom: 19 }
).addTo(map);

setTimeout(() => map.invalidateSize(), 500);

// ==========================================
// MASSIVE CITY LIST
// ==========================================
const cities = [
{name:"New York",lat:40.71,lon:-74.00},
{name:"Los Angeles",lat:34.05,lon:-118.24},
{name:"Chicago",lat:41.87,lon:-87.62},
{name:"Toronto",lat:43.65,lon:-79.38},
{name:"London",lat:51.50,lon:-0.12},
{name:"Paris",lat:48.85,lon:2.35},
{name:"Berlin",lat:52.52,lon:13.40},
{name:"Madrid",lat:40.41,lon:-3.70},
{name:"Rome",lat:41.90,lon:12.49},
{name:"Moscow",lat:55.75,lon:37.61},
{name:"Istanbul",lat:41.00,lon:28.97},
{name:"Dubai",lat:25.20,lon:55.27},
{name:"Doha",lat:25.29,lon:51.53},
{name:"Riyadh",lat:24.71,lon:46.67},
{name:"Mumbai",lat:19.07,lon:72.87},
{name:"Delhi",lat:28.61,lon:77.20},
{name:"Bangalore",lat:12.97,lon:77.59},
{name:"Chennai",lat:13.08,lon:80.27},
{name:"Hyderabad",lat:17.38,lon:78.48},
{name:"Tokyo",lat:35.67,lon:139.69},
{name:"Osaka",lat:34.69,lon:135.50},
{name:"Seoul",lat:37.56,lon:126.97},
{name:"Beijing",lat:39.90,lon:116.40},
{name:"Shanghai",lat:31.23,lon:121.47},
{name:"Singapore",lat:1.29,lon:103.85},
{name:"Bangkok",lat:13.75,lon:100.50},
{name:"Jakarta",lat:-6.20,lon:106.84},
{name:"Sydney",lat:-33.86,lon:151.21},
{name:"Melbourne",lat:-37.81,lon:144.96},
{name:"Cape Town",lat:-33.92,lon:18.42},
{name:"Cairo",lat:30.04,lon:31.23},
{name:"Nairobi",lat:-1.29,lon:36.82},
{name:"Lagos",lat:6.52,lon:3.37},
{name:"Sao Paulo",lat:-23.55,lon:-46.63},
{name:"Buenos Aires",lat:-34.60,lon:-58.38}
];

// ==========================================
// MARKERS
// ==========================================
cities.forEach(c => {
  const marker = L.circleMarker([c.lat, c.lon], {
    radius: 6,
    color: "#00eaff",
    fillColor: "#00eaff",
    fillOpacity: 0.75
  }).addTo(map);

  marker.on("click", () => loadCity(c));
});

// ==========================================
// RANDOM HELPERS
// ==========================================
function pick(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

// ==========================================
// CITY DATA
// ==========================================
function loadCity(city){

  const weather = [
    "Sunny",
    "Cloudy",
    "Heavy Rain",
    "Thunderstorm",
    "Clear Sky",
    "Foggy",
    "Windy"
  ];

  const ai = [
    "Strong trade activity with stable outlook.",
    "Strategic logistics hub with growing demand.",
    "Weather may impact transport operations.",
    "Moderate growth expected in coming weeks.",
    "Region remains economically significant.",
    "Urban expansion and high connectivity observed."
  ];

  info.innerHTML = `
    <h2>🌍 ${city.name}</h2>

    <span style="color:lime;">● LIVE</span><br><br>

    🌦 ${pick(weather)}<br>
    🌡 ${rand(18,39)} °C<br>
    💨 Wind: ${rand(4,22)} km/h<br>
    📍 ${city.lat}, ${city.lon}<br><br>

    🧠 ${pick(ai)}<br><br>

    ⏱ ${new Date().toLocaleTimeString()}
  `;
}

// ==========================================
// NEWS
// ==========================================
function loadNews(){

  info.innerHTML = `
    <h2>📰 GLOBAL LIVE NEWS</h2>
    <div id="newsbox"></div>
  `;

  const headlines = [
    "Markets rise after technology rally",
    "Storm alert issued in coastal regions",
    "Oil prices remain stable globally",
    "Shipping routes normalize worldwide",
    "Central banks expected to pause rates",
    "Tourism demand increases this quarter",
    "New AI investments boost markets"
  ];

  let i = 0;

  setInterval(() => {
    const box = document.getElementById("newsbox");
    if(box){
      box.innerHTML =
      `<span style="color:lime;">● LIVE</span><br><br>${headlines[i]}`;
      i = (i+1)%headlines.length;
    }
  }, 2000);
}

// ==========================================
// STOCKS
// ==========================================
function loadStock(){

  info.innerHTML = `
    <h2>📈 LIVE MARKETS</h2>
    <div id="stockbox"></div>
  `;

  let aapl = 212.5;
  let tsla = 181.4;
  let btc = 68100;

  setInterval(() => {

    aapl += (Math.random()-0.5)*1.8;
    tsla += (Math.random()-0.5)*2.5;
    btc += (Math.random()-0.5)*150;

    const box = document.getElementById("stockbox");

    if(box){
      box.innerHTML = `
      <span style="color:lime;">● LIVE</span><br><br>
      AAPL: $${aapl.toFixed(2)}<br><br>
      TSLA: $${tsla.toFixed(2)}<br><br>
      BTC: $${btc.toFixed(0)}<br><br>
      NASDAQ: ${rand(18120,18390)}
      `;
    }

  }, 1400);
}

// ==========================================
// GLOBE
// ==========================================
function initGlobe(){

  globe = Globe()(document.getElementById("globe"))
  .globeImageUrl(
   "//unpkg.com/three-globe/example/img/earth-night.jpg"
  )
  .backgroundColor("#000");

  globe.pointsData(
    cities.map(c => ({
      lat:c.lat,
      lng:c.lon,
      size:0.35,
      name:c.name
    }))
  )
  .pointAltitude(0.04)
  .pointLabel("name");

  globe.onPointClick(p=>{
    loadCity({
      name:p.name,
      lat:p.lat,
      lon:p.lng
    });
  });
}

// ==========================================
// TOGGLE
// ==========================================
function toggleView(){

  is3D = !is3D;

  document.getElementById("map").style.display =
    is3D ? "none":"block";

  document.getElementById("globe").style.display =
    is3D ? "block":"none";

  if(is3D && !globe){
    initGlobe();
  }

  setTimeout(()=>map.invalidateSize(),500);
}

// ==========================================
// DEFAULT PANEL
// ==========================================
info.innerHTML = `
<h2>🌐 Global Intelligence Dashboard</h2>

Click any city marker.<br><br>

Use sidebar:<br>
🌍 2D / 3D Globe<br>
📰 News Feed<br>
📈 Markets<br><br>

<span style="color:lime;">● FULL DEMO MODE ACTIVE</span>
`;
