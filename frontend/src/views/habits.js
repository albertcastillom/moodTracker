import { wireHabitsUI } from "../ui/habits";

export async function habitsView(outlet) {
  outlet.innerHTML = `
    <div>
      <h1>Habits Tracking</h1>
      <form id="habitForm">
        <input id="habitName" placeholder="New habit (e.g., Walk 10 min)" />
        <button type="submit">Add</button>
      </form>

      <ul id="habitsList"></ul>
      <p id="habitsStatus"></p>
    </div>
  `;

  wireHabitsUI(outlet);
}
