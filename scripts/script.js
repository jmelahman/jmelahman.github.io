/* When the user clicks on the button,
toggle between hiding and displaying the menu */
function pushMenu(id) {
  element = document.getElementById(id)
  if (element.style.display !== "block") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}