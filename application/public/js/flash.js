function fadeOut() {
  const flashmessage = document.getElementById("flash-message");
  setTimeout(() => {
    flashmessage.classList.add("fade-out");
  }, 4000);
  setTimeout(() => {
    flashmessage.remove();
  }, 4500);
}

fadeOut();
