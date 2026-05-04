let historyContainer = document.querySelector(".sidebar__content");
let history = [];

/**
 * updates the history display in the sidebar with the current history items.
 * reverses the order to show the most recent calculations first.
 */
function updateHistory() {
  historyContainer.innerHTML = "";
  history
    .slice()
    .reverse()
    .forEach((item) => {
      let p = document.createElement("p");
      p.textContent = item;
      historyContainer.appendChild(p);
    });
}

export { updateHistory, history };
