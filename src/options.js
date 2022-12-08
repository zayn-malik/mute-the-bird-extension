window.addEventListener("load", () => {
  // Get the form element
  const form = document.getElementById("myForm");

  // Add 'submit' event handler
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const FD = new FormData(form);
    let output = FD.get("name");

    chrome.storage.local.set(
      {
        optionsToken: output,
      },
      () => {
        window.close();
      }
    );
  });
});
