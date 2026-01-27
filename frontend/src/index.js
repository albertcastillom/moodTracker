import { createRouter } from "./router.js";
import { homeView } from "./views/homeView.js";
import { habitsView } from "./views/habitsView.js";
import { journalView } from "./views/journalView.js";
//import { notFoundView } from "./views/404.js"; // if you add it

import "./styles.css";

window.addEventListener("DOMContentLoaded", () => {
  const outlet = document.getElementById("app");

  const router = createRouter({
    outlet,
    routes: {
      "/": homeView,
      "/habits": habitsView,
      "/journal": journalView,
      // "/404": notFoundView,
    },
  });

  router.start();
});
