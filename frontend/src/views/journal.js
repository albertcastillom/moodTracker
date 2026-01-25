import { wireJournalUI } from "../ui/journalUI";

export async function journalView(outlet) {
  outlet.innerHTML = `
    <div>
      <h1>Daily Journal Entries</h1>
      <form id="journalForm">
        <input id="journalEntry" placeholder="Tell me about your day :)" />
        <button type="submit">Submit</button>
      </form>

      <ul id="journalEntryList"></ul>
    </div>
  `;

  wireJournalUI(outlet);
}
