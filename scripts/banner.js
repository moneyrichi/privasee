function acceptAll() {
  localStorage.setItem("cookieConsent", JSON.stringify({ accepted: true, categories: ["essential", "analytics", "marketing"] }));
  document.getElementById("cookie-banner").style.display = "none";
}

function rejectAll() {
  localStorage.setItem("cookieConsent", JSON.stringify({ accepted: false, categories: [] }));
  document.getElementById("cookie-banner").style.display = "none";
}

function customize() {
  alert("Customization modal coming soon.");
}
