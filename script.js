let is3D = false;
let globe = null;

const info = document.getElementById("info");

// MAP
const map = L.map("map").setView([20,0],2);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { maxZoom:19 }
).addTo(map);

setTimeout(() => map.invalidateSize(), 500);

// CITIES
const cities = [
  {name:"Bangalore",lat:12.97,lon:77.59},
  {name:"Mumbai",lat:19.07,lon:72.87},
  {name:"Delhi",lat:28.61,lon:77.20},
  {name:"London",lat:51.50,lon:-0.12},
  {name:"Paris",lat:48.85,lon:2.35},
  {name:"Berlin",lat:52.52,lon:13.40},
  {name:"New York",lat:40.71,lon:-74.00},
  {name:"Toronto",lat:43.65,lon:-79.38},
  {name:"Tokyo",lat:35.67,lon:139.69},
  {name:"Dubai",lat:25.20,lon:55.27},
  {name:"Singapore",lat:1.29,lon:103.85},
  {name:"Sydney",lat:-33.86,lon:151.21}
];

// MARKERS
cities.forEach(c=>{
  const m = L.marker([c.lat,c.lon]).addTo(map);
  m.on("click",()=>loadData(c.lat,c.lon,c.name));
});

map.on("click",e=>{
  loadData(e.latlng.lat,e.latlng.lng,"Custom Location");
});

// LOAD DATA
async function loadData(lat,lon,name){

  info.innerHTML="Loading...";

  try{
    const weather = await fetch(`/weather?lat=${lat}&lon=${lon}`)
      .then(r=>r.json());

    const ai = await fetch("/ai",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({lat,lon})
    }).then(r=>r.json());

    info.innerHTML=`
      <h2>${name}</h2>

      🌦 ${weather.weather?.[0]?.description || "N/A"}<br>
      🌡 ${(weather.main?.temp - 273.15).toFixed(1)} °C<br><br>

      🧠 ${ai.result}
    `;

  }catch(err){
    console.error(err);
    info.innerHTML="Failed to load.";
  }
}

// NEWS LINKS
function loadNews(){

  info.innerHTML=`
    <h2>📰 News</h2>

    <a href="https://www.bbc.com/news" target="_blank">BBC</a><br><br>

    <a href="https://www.reuters.com/world/" target="_blank">Reuters</a><br><br>

    <a href="https://www.aljazeera.com/news/" target="_blank">Al Jazeera</a><br><br>

    <a href="https://edition.cnn.com/world" target="_blank">CNN</a><br><br>

    <a href="https://www.dw.com/en/top-stories/s-9097" target="_blank">DW</a>
  `;
}

// STOCK LINKS
function loadStock(){

  info.innerHTML=`
    <h2>📈 Markets</h2>

    <a href="https://finance.yahoo.com" target="_blank">Yahoo Finance</a><br><br>

    <a href="https://www.tradingview.com/markets/" target="_blank">TradingView</a><br><br>

    <a href="https://www.marketwatch.com" target="_blank">MarketWatch</a><br><br>

    <a href="https://www.nasdaq.com" target="_blank">Nasdaq</a><br><br>

    <a href="https://www.google.com/finance/" target="_blank">Google Finance</a>
  `;
}

// 3D GLOBE
function initGlobe(){

  globe = Globe()(document.getElementById("globe"))
    .globeImageUrl(
      "//unpkg.com/three-globe/example/img/earth-night.jpg"
    )
    .backgroundColor("#000");

  globe.pointsData(
    cities.map(c=>({
      lat:c.lat,
      lng:c.lon,
      size:0.3,
      name:c.name
    }))
  )
  .pointAltitude(0.03)
  .pointLabel("name");

  globe.onPointClick(p=>{
    loadData(p.lat,p.lng,p.name);
  });
}

// TOGGLE
function toggleView(){

  is3D=!is3D;

  document.getElementById("map").style.display=
    is3D ? "none":"block";

  document.getElementById("globe").style.display=
    is3D ? "block":"none";

  if(is3D && !globe){
    initGlobe();
  }

  setTimeout(()=>map.invalidateSize(),500);
}