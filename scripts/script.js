let toggleBtn = document.querySelector(".more__logo__btn");
let sideBar = document.querySelector(".calculator-sidebar");
let calculatorKeypad = document.querySelector(".calculator__keypad");

toggleBtn.addEventListener("click", () => {
  sideBar.classList.toggle("active"); // show/hide sidebar
  calculatorKeypad.classList.toggle("sidebar-open"); // adjust layout
});
