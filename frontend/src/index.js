import './styles.css';

// ============ Helpers ============
const $ = (id) => document.getElementById(id);

// ============ UI Updaters ============
function updateOutput(val) {
  const el = $('ratingValue');
  if (el) el.textContent = val;
}

// ============ API ============
async function loadAverage() {
  const averageEl = $('averageDisplay');
  if (!averageEl) return;

  try {
    const res = await fetch('/average');
    if (!res.ok) throw new Error('Average fetch failed');
    const data = await res.json();
    averageEl.textContent = `Average Rating: ${Number(data.average ?? 0).toFixed(2)}`;
  } catch (err) {
    console.error(err);
    averageEl.textContent = 'Average Rating: --';
  }
}

async function submitRating() { 
  const ratingEl = $('rangeRating');
  if (!ratingEl) return;

  const rating = Number(ratingEl.value);
  try {
    const res = await fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    if (!res.ok) throw new Error('Submit failed');
    await loadAverage();

    $('rating-submit-btn')?.classList.add('clicked');
     setTimeout(() =>  $('rating-submit-btn')?.classList.remove('clicked'), 2000);

  } catch (err) {
    console.error(err);
  }
}

// ============ Navigation & Slides ============
function goBack() {
  window.location.href = 'index.html';
}
function goSlides() {
  window.location.href = 'feelingSlides.html';
}
function nextSlide(current) {
  const cur = $(`slide-${current}`);
  const next = $(`slide-${current + 1}`);
  if (cur) cur.classList.remove('active');
  if (next) next.classList.add('active');
}

window.goBack = goBack;
window.goSlides = goSlides;
window.submitRating = submitRating;  
window.updateOutput = updateOutput;  
window.nextSlide = nextSlide; 

// ============ Wire-up ============
window.addEventListener('DOMContentLoaded', () => {
  // Average
  if ($('averageDisplay')) loadAverage();

  // Clock
  const datetimeEl = $('datetime');
  if (datetimeEl) {
    const tick = () => {
      const now = new Date();
      datetimeEl.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    };
    tick(); // set immediately
    setInterval(tick, 1000);
  }

  // Slider readout
  const ratingEl = $('rangeRating');
  if (ratingEl) {
    updateOutput(ratingEl.value); // set initial readout
    ratingEl.addEventListener('input', (e) => updateOutput(e.target.value));
  }

  // Submit
  const submitBtn = $('rating-submit-btn');
  if (submitBtn)  submitBtn.addEventListener('click', submitRating);
    


  // Bar visual (1..10)
  const input = $('userInput');
  const bar = $('bar');
  const display = $('value-display');
  if (input && bar && display) {
    const clampAndRender = () => {
      let value = Number(input.value);
      if (!Number.isFinite(value) || value < 1) value = 1;
      if (value > 10) value = 10;
      bar.style.width = `${value * 10}%`;
      display.textContent = value;
    };
    clampAndRender(); 
    input.addEventListener('input', clampAndRender);
  }
});

// ============ Users Location ============
function getCoordinates() 
{
  var options = 
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos)
  {
    var crd = pos.coords; 
    var lat = crd.latitude.toString(); 
    var long = crd.longitude.toString();
    var coords = [lat, long];
    console.log(`Latitude: ${lat}, Longitude: ${long}`);
    getCity(coords);
    return; 
  }

  function error(err) 
  {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    return;
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
}

function getCity(coords) 
{
   var xhr = new XMLHttpRequest();
   var lat = coords[0];
   var long = coords[1]; 
   xhr.open('GET', `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`, true);
   xhr.send();
   xhr.onreadystatechange = processRequest; 
   xhr.addEventListener("readystatechange", processRequest, false);
    function processRequest(e)
    {
      if(xhr.readyState == 4 && xhr.status == 200)
      {
        var response = JSON.parse(xhr.responseText); 
        var city = response.address.city; 
        console.log(city);
        return; 
      }
    }
}
getCoordinates(); // Call the function to get user's location
