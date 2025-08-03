import './styles.css';
/*
function updateOutput(val) {
  document.getElementById('ratingValue').textContent = val;
}

function submitRating() {
  const rating = parseInt(document.getElementById('rangeRating').value);
  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating })
  })
    .then(res => res.json())
    .then(() => {
      loadAverage();
    });
}

function loadAverage() {
  fetch('/average')
    .then(res => res.json())
    .then(data => {
      document.getElementById('averageDisplay').textContent =
        `Average Rating: ${data.average.toFixed(2)}`;
    });
}

function goBack() {
  window.location.href = 'feelingSlides.html';
}

window.onload = function () {
  loadAverage();

  setInterval(() => {
    const date = new Date();
    const displayDate = date.toLocaleDateString();
    const displayTime = date.toLocaleTimeString();
    document.getElementById('datetime').innerHTML = displayDate + " " + displayTime;
  }, 1000);

  const input = document.getElementById('userInput');
  const bar = document.getElementById('bar');
  const display = document.getElementById('value-display');

  input.addEventListener('input', () => {
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 10) value = 10;
    bar.style.width = (value * 10) + '%';
    display.textContent = value;
  });
};
*/