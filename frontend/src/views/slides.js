export async function slidesView(outlet) {
  outlet.innerHTML = `
    <div>
      <h1>Feeling Slides</h1>
      <p>Put your slide flow here.</p>
      <a href="/" data-link>← Back</a>
    </div>
  `;
}
