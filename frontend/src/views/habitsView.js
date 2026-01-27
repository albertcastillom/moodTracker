import { wireHabitsUI } from "../ui/habitsUI";

export async function habitsView(outlet) {
  outlet.innerHTML = `
   <section class="page page--habits">
      <header class="page__header">
        <h1>Habits</h1>
        <p class="page__sub">Tap to mark done today.</p>
      </header>

      <form id="habitForm" class="form-row">
        <input id="habitName" placeholder="New habit (e.g., Walk 10 min)" />
        <button type="submit" class="btn">Add</button>
      </form>

      <div id="habitsStatus" class="status"></div>
      <div id="habitsList" class="grid habits-grid"></div>
    </section>

  `;

  wireHabitsUI(outlet);
}
