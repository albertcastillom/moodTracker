import { getHabits, createHabit, toggleHabitDone } from "../api.js";

export function wireHabitsUI(outlet) {
  const form = outlet.querySelector("#habitForm");
  const input = outlet.querySelector("#habitName");
  const list = outlet.querySelector("#habitsList");
  const status = outlet.querySelector("#habitsStatus");

  async function refreshHabits() {
    status.textContent = "Loading habits...";
    const habits = await getHabits();
    render(habits);
    status.textContent = "";
  }

  function render(habits) {
    list.innerHTML = "";
    habits.forEach((habit) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "habit-card";
      card.setAttribute("aria-pressed", String(!!habit.completed));

      const title = document.createElement("div");
      title.className = "habit-card__title";
      title.textContent = habit.name;

      const meta = document.createElement("div");
      meta.className = "habit-card__meta";
      meta.textContent = habit.completed ? "Done today" : "Not done";

      card.addEventListener("click", async () => {
        await toggleHabitDone(habit.id, !habit.completed);
        await refreshHabits();
      });

      card.append(title, meta);
      list.appendChild(card);
    });
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;

    await createHabit({ name });
    input.value = "";
    await refreshHabits();
  });

  refreshHabits();
}
