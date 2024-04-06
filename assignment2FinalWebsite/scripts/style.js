// Prompting the chosenStateButton animation
var chosenButton = document.getElementsByClassName('chosenStateButton');
var animatedButton = null;
Array.from(chosenButton).forEach(function (button) {
  button.addEventListener('click', function () {
    if (animatedButton != null) {
      animatedButton.classList.remove('beating');
    } else {
      button.classList.add('beating');
      animatedButton = button;
    }
  });
});
// Delete birds when clicked animation
function deleteBird(birdTag) {
  document.getElementById(birdTag).style.scale = 0
  setTimeout(() => { document.getElementById(birdTag).style.scale = 1 }, 5000);
}
// Changing number animation
const timing = 250
const numberCount = document.querySelectorAll('.count')
numberCount.forEach((counter) => {
  function changingNumber() {
    const numberCount = Number(counter.innerText)
    const aim = Number(counter.getAttribute('end-number'))
    const increment = aim / timing
    if (numberCount < aim) {
      counter.innerText = Math.floor(increment + numberCount)
      setTimeout(changingNumber, 15)
    } else {
      counter.innerText = aim
    }
  }
  changingNumber()
})