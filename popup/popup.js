import { heuristicScore } from "../detection/detector.js";

chrome.storage.local.get("lastEmail", data => {
  const email = data.lastEmail;
  if (!email) {
    document.getElementById("score").innerText = "No email detected.";
    return;
  }

  const result = heuristicScore(email);

  // Display score
  document.getElementById("score").innerText = `${result.score}% suspicious`;

  // Display reasons
  const reasonsEl = document.getElementById("reasons");
  result.reasons.forEach(r => {
    const li = document.createElement("li");
    li.innerText = r;
    reasonsEl.appendChild(li);
  });
});
