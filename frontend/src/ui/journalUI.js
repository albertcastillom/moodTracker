import { getJournalEntries, createJournalEntry } from "../api.js";

export function wireJournalUI(outlet) {
  const form = outlet.querySelector("#journalForm");
  const input = outlet.querySelector("#journalEntry");
  const list = outlet.querySelector("#journalEntryList");

  async function refreshJournal() {
    const journal = await getJournalEntries();
    render(journal);
  }

  function render(journal) {
    list.innerHTML = "";
    journal.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "entry-card";

      const header = document.createElement("button");
      header.type = "button";
      header.className = "entry-card__header";
      header.textContent = entry.date ? entry.date : "Entry";

      const body = document.createElement("div");
      body.className = "entry-card__body";
      body.textContent = entry.entry;

      // collapsed by default
      body.setAttribute("data-collapsed", "true");

      header.addEventListener("click", () => {
        const collapsed = body.getAttribute("data-collapsed") === "true";
        body.setAttribute("data-collapsed", collapsed ? "false" : "true");
      });

      card.append(header, body);
      list.appendChild(card);
    });
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const entry = input.value.trim();
    if (!entry) return;

    await createJournalEntry({ entry });
    input.value = "";
    await refreshJournal();
  });

  refreshJournal();
}
