import { wireJournalUI } from "../ui/journalUI";

export async function journalView(outlet) {
  outlet.innerHTML = `
    <section class="page page--journal">
      <header class="page__header">
        <h1>Journal</h1>
        <p class="page__sub">Write a daily entry. Click a card to expand.</p>
      </header>

      <form id="journalForm" class="journal-form">
        <textarea id="journalEntry" rows="5" placeholder="Tell me about your day :)"></textarea>
        <button type="submit" class="btn">Save entry</button>
      </form>

      <div id="journalEntryList" class="grid journal-grid"></div>
    </section>
  `;

  wireJournalUI(outlet);
}
