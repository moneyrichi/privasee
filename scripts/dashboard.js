const auth = firebase.auth();

// Sign in with Google
function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => console.log("Signed in"))
    .catch(err => console.error("Sign-in error:", err));
}

// Sign out
function signOut() {
  auth.signOut()
    .then(() => console.log("Signed out"))
    .catch(err => console.error("Sign-out error:", err));
}

// Monitor Auth State
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline-block";

    // Show dashboard
    document.getElementById("dashboard-content").style.display = "block";

    // Load data
    loadAll();
  } else {
    // User is signed out
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("login-btn").style.display = "inline-block";
    document.getElementById("logout-btn").style.display = "none";

    // Hide dashboard
    document.getElementById("dashboard-content").style.display = "none";
  }
});


// Track the current view
let currentSnapshot = null;

// Load all consents
function loadAll() {
  db.collection("consents").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    currentSnapshot = snapshot;
    displayTable(snapshot);
  });
}

// Load only accepted consents
function loadAccepted() {
  db.collection("consents").where("accepted", "==", true).orderBy("timestamp", "desc").onSnapshot(snapshot => {
    currentSnapshot = snapshot;
    displayTable(snapshot);
  });
}

// Load only rejected consents
function loadRejected() {
  db.collection("consents").where("accepted", "==", false).orderBy("timestamp", "desc").onSnapshot(snapshot => {
    currentSnapshot = snapshot;
    displayTable(snapshot);
  });
}

// Load consents by selected category
function loadByCategory(category) {
  db.collection("consents")
    .where("categories", "array-contains", category)
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      currentSnapshot = snapshot;
      displayTable(snapshot);
    });
}

// Display the table based on the snapshot
function displayTable(snapshot) {
  const tableBody = document.getElementById("consent-table-body");
  tableBody.innerHTML = ""; // Clear the table

  snapshot.forEach(doc => {
    const data = doc.data();
    const row = document.createElement("tr");

    let dateString = "";
    if (data.timestamp && data.timestamp.toDate) {
      dateString = data.timestamp.toDate().toLocaleString();
    }

    row.innerHTML = `
      <td>${data.categories.join(", ")}</td>
      <td>${data.accepted ? "Accepted" : "Rejected"}</td>
      <td>${dateString}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Export currently displayed (filtered) data to CSV
function exportCSV() {
  if (!currentSnapshot) {
    console.error("No data to export.");
    return;
  }

  let csv = "Categories,Accepted,Timestamp\n";

  currentSnapshot.forEach(doc => {
    const data = doc.data();
    const categories = data.categories.join(" | ");
    const accepted = data.accepted ? "Accepted" : "Rejected";
    let dateString = "";

    if (data.timestamp && data.timestamp.toDate) {
      dateString = data.timestamp.toDate().toLocaleString();
    }

    csv += `"${categories}","${accepted}","${dateString}"\n`;
  });

  const hiddenElement = document.createElement("a");
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'consent_logs.csv';
  hiddenElement.click();
}

// Load all consents by default on page load
loadAll();
