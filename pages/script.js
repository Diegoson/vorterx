document.getElementById("submit").addEventListener("click", function () {
  const loader = document.getElementById("coolLoader");
  const message = document.getElementById("message");
  message.textContent = "";
  loader.style.display = "block";
  setTimeout(() => {
    loader.style.display = "none";
    message.classList.add("success");
  }, 4000); 
});
