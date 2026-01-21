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
      const li = document.createElement("li");

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!habit.doneToday;
      cb.addEventListener("change", async () => {
        await toggleHabitDone(habit.id, cb.checked);
        await refreshHabits();
      });
      const span = document.createElement("span");
      span.textContent = habit.name;

      li.appendChild(cb);
      li.appendChild(span);
      list.appendChild(li);
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
