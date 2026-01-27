import { fetchAverage, submitMoodRating } from "../api.js";

const $ = (id) => document.getElementById(id);

export function updateOutput(val) {
  const el = $("ratingValue");
  if (el) el.textContent = val;
}

export async function loadAverage() {
  const averageEl = $("averageDisplay");
  if (!averageEl) return;

  try {
    const data = await fetchAverage();
    averageEl.textContent = `Average Rating: ${Number(
      data.average ?? 0,
    ).toFixed(2)}`;
  } catch (err) {
    console.error(err);
    averageEl.textContent = "Average Rating: --";
  }
}

export async function submitRating() {
  const ratingEl = $("rangeRating");
  if (!ratingEl) return;

  const rating = Number(ratingEl.value);
  try {
    await submitMoodRating(rating);
    await loadAverage();

    $("rating-submit-btn")?.classList.add("clicked");
    setTimeout(() => $("rating-submit-btn")?.classList.remove("clicked"), 2000);
  } catch (err) {
    console.error(err);
  }
}

export function wireMoodUI() {
  // Average
  if ($("averageDisplay")) loadAverage();

  // Slider readout
  const ratingEl = $("rangeRating");
  if (ratingEl) {
    updateOutput(ratingEl.value);
    ratingEl.addEventListener("input", (e) => updateOutput(e.target.value));
  }

  // Submit
  const submitBtn = $("rating-submit-btn");
  if (submitBtn) submitBtn.addEventListener("click", submitRating);
}
