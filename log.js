document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      Toastify({
        text: "Veuillez remplir tous les champs",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)"
        },
        close: true
      }).showToast();
      return;
    }

    Toastify({
      text: "Connexion réussie! Redirection...",
      duration: 1000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right,rgb(196, 140, 38),rgb(180, 201, 61))"
      },
      close: true
    }).showToast();

    setTimeout(() => {
      window.location.href = "mess.html";
    }, 1000);
  });