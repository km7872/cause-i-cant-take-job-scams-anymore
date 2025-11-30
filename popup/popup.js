// Import the new logic we wrote (make sure path is correct)
import { analyzeJobScam } from "../detection/detector.js";

// DOM Elements
const verdictBox = document.getElementById("verdict-box");
const verdictText = document.getElementById("verdict-text");
const verdictIcon = document.getElementById("verdict-icon");
const scoreText = document.getElementById("score-text");
const analysisSection = document.getElementById("analysis-section");
const reasonsList = document.getElementById("reasons-list");

// Main Logic
chrome.storage.local.get("lastEmail", (data) => {
  const email = data.lastEmail;

  // 1. Handle Empty State
  if (!email || !email.body) {
    setUiState("neutral", "No Email Found", "Please open a job email to scan.");
    return;
  }

  // 2. Run Analysis
  const result = analyzeJobScam(email);

  // 3. Determine Tier
  if (result.score >= 50) {
    // RED: High Confidence Scam
    setUiState("danger", "HIGH RISK SCAM", `Risk Score: ${result.score}%`);
    renderReasons(result.reasons, "❌");
  } else if (result.score >= 20) {
    // YELLOW: Suspicious
    setUiState("warn", "SUSPICIOUS", `Risk Score: ${result.score}%`);
    renderReasons(result.reasons, "⚠️");
  } else {
    // GREEN: Likely Safe
    setUiState("safe", "LIKELY SAFE", `Risk Score: ${result.score}%`);
    
    // If safe, show a positive message in the list
    analysisSection.classList.remove("hidden");
    reasonsList.innerHTML = `
      <li class="reason-item">
        <span class="reason-icon">✅</span>
        <span>No major red flags detected. Always verify sender identity.</span>
      </li>
    `;
  }
});

// Helper: Set Colors and Text
function setUiState(stateClass, title, subtitle) {
  // Reset classes
  verdictBox.className = "verdict-box"; 
  // Add new class
  verdictBox.classList.add(`state-${stateClass}`);
  
  // Set Icon
  const icons = {
    neutral: "🔍",
    safe: "🛡️",
    warn: "✋",
    danger: "🚨"
  };
  
  verdictIcon.textContent = icons[stateClass];
  verdictText.textContent = title;
  scoreText.textContent = subtitle;
}

// Helper: Render the list of reasons
function renderReasons(reasons, iconChar) {
  analysisSection.classList.remove("hidden");
  reasonsList.innerHTML = ""; // Clear list

  if (reasons.length === 0) return;

  reasons.forEach(reason => {
    const li = document.createElement("li");
    li.className = "reason-item";
    
    const iconSpan = document.createElement("span");
    iconSpan.className = "reason-icon";
    iconSpan.textContent = iconChar;

    const textSpan = document.createElement("span");
    textSpan.textContent = reason;

    li.appendChild(iconSpan);
    li.appendChild(textSpan);
    reasonsList.appendChild(li);
  });
}