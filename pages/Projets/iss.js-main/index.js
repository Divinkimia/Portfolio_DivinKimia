/**
 * Position ISS en temps quasi réel (API Where The ISS At + Leaflet / OSM).
 */

const API_URL = "https://api.wheretheiss.at/v1/satellites/25544/";
const POLL_MS = 4000;

let map;
let issMarker;
let firstRun = true;

const el = {
  lat: document.getElementById("lat"),
  lon: document.getElementById("lon"),
  alt: document.getElementById("alt"),
  speed: document.getElementById("speed"),
  updated: document.getElementById("updated"),
  status: document.getElementById("status"),
};

function formatTime(isoOrTimestamp) {
  if (isoOrTimestamp == null) return "—";
  const d =
    typeof isoOrTimestamp === "number"
      ? new Date(isoOrTimestamp * 1000)
      : new Date(isoOrTimestamp);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

function initMap(lat, lon) {
  map = L.map("issMap", {
    zoomControl: true,
    worldCopyJump: true,
  }).setView([lat, lon], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const icon = L.divIcon({
    className: "iss-marker-wrap",
    html: '<div class="iss-marker" aria-hidden="true">🛰️</div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  issMarker = L.marker([lat, lon], { icon }).addTo(map);

  const style = document.createElement("style");
  style.textContent = `
    .iss-marker-wrap { background: transparent; border: none; }
    .iss-marker {
      font-size: 1.75rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,.35));
      line-height: 1;
    }
  `;
  document.head.appendChild(style);
}

function updateMap(lat, lon) {
  if (!map || !issMarker) return;
  issMarker.setLatLng([lat, lon]);
  if (firstRun) {
    firstRun = false;
    return;
  }
  map.panTo([lat, lon], { animate: true, duration: 0.45, easeLinearity: 0.35 });
}

function renderData(data) {
  const { latitude, longitude, altitude, velocity } = data;

  el.lat.textContent = latitude.toFixed(5);
  el.lon.textContent = longitude.toFixed(5);
  el.alt.textContent = `${altitude.toFixed(2)} km`;
  el.speed.textContent = `${velocity.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} km/h`;

  const ts = data.timestamp;
  el.updated.textContent = formatTime(ts);

  updateMap(latitude, longitude);
  el.status.textContent = "Données à jour.";
  el.status.classList.remove("status--error");
}

async function fetchISS() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const { latitude, longitude } = data;
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new Error("Coordonnées invalides");
    }

    if (!map) {
      initMap(latitude, longitude);
    }

    renderData(data);
  } catch (err) {
    console.error(err);
    el.status.textContent =
      "Impossible de récupérer la position (réseau ou API indisponible). Nouvel essai bientôt…";
    el.status.classList.add("status--error");
  }
}

fetchISS();
setInterval(fetchISS, POLL_MS);
