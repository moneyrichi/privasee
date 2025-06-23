// Correct Firestore timestamp for Firebase CDN setup
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

// Accept All Consent
function acceptAll() {
  const consent = {
    accepted: true,
    categories: ["essential", "analytics", "marketing"],
    timestamp: serverTimestamp()
  };

  localStorage.setItem("cookieConsent", JSON.stringify(consent));
  document.getElementById("cookie-banner").style.display = "none";

  db.collection("consents").add(consent)
    .then(() => console.log("Consent logged"))
    .catch(err => console.error("Error logging:", err));
}

// Reject All Consent
function rejectAll() {
  const consent = {
    accepted: false,
    categories: [],
    timestamp: serverTimestamp()
  };

  localStorage.setItem("cookieConsent", JSON.stringify(consent));
  document.getElementById("cookie-banner").style.display = "none";

  db.collection("consents").add(consent)
    .then(() => console.log("Rejection logged"))
    .catch(err => console.error("Error logging:", err));
}

// Customize Consent (shows modal)
function customize() {
  document.getElementById("customize-modal").style.display = "block";
}

// Close Modal
function closeModal() {
  document.getElementById("customize-modal").style.display = "none";
}

// Save Preferences from Customize Modal
document.getElementById("customize-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const checkboxes = document.querySelectorAll('input[name="categories"]:checked');
  const selectedCategories = Array.from(checkboxes).map(cb => cb.value);

  const consent = {
    accepted: true,
    categories: selectedCategories,
    timestamp: serverTimestamp()
  };

  localStorage.setItem("cookieConsent", JSON.stringify(consent));
  document.getElementById("cookie-banner").style.display = "none";
  document.getElementById("customize-modal").style.display = "none";

  db.collection("consents").add(consent)
    .then(() => console.log("Customized consent logged"))
    .catch(err => console.error("Error logging customized consent:", err));
});

// Make functions globally accessible
window.acceptAll = acceptAll;
window.rejectAll = rejectAll;
window.customize = customize;
window.closeModal = closeModal;
