const toggleBtn = document.querySelector(".more__logo__btn");
const sidebar = document.querySelector(".calculator-sidebar");
const calculator__keypad = document.querySelector(".calculator__keypad");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active"); // show/hide sidebar
  calculator__keypad.classList.toggle("sidebar-open"); // adjust layout
});
