export function wireLocation() {
  const locationEl = document.getElementById("location");
  if (!locationEl) return;

  if (!navigator.geolocation) {
    locationEl.textContent = "Location unavailable";
    return;
  }

  const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;

      try {
        // Prefer fetch over XHR
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lon)}&format=json`;

        const res = await fetch(url, {
          headers: {
            // Nominatim prefers identifying headers. This helps reduce blocks.
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Reverse geocode failed");
        const data = await res.json();

        const addr = data.address || {};
        const place =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.hamlet ||
          addr.county ||
          "Unknown";

        locationEl.textContent = place;
      } catch (e) {
        console.error(e);
        locationEl.textContent = "Location unavailable";
      }
    },
    (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      locationEl.textContent = "Location denied";
    },
    options
  );
}
