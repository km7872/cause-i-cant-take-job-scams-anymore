import { analyzeJobScam } from "../detection/detector.js";

// DOM Elements
const verdictBox = document.getElementById("verdict-box");
const verdictText = document.getElementById("verdict-text");
const verdictIcon = document.getElementById("verdict-icon");
const scoreText = document.getElementById("score-text");
const analysisSection = document.getElementById("analysis-section");
const reasonsList = document.getElementById("reasons-list");

// 1. Get the current active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];

  // 2. Send a message to the content script in that tab
  chrome.tabs.sendMessage(currentTab.id, { action: "scan_email" }, (response) => {
    
    // Handle connection errors (e.g., if user is on a non-Gmail page)
    if (chrome.runtime.lastError || !response || !response.success) {
      setUiState("neutral", "No Email Detected", "Open a specific email message to scan.");
      return;
    }

    // 3. We got data! Run Analysis
    const email = response.data;
    const result = analyzeJobScam(email);

    // 4. Determine Tier (Same logic as before)
    if (result.score >= 50) {
      setUiState("danger", "HIGH RISK SCAM", `Risk Score: ${result.score}%`);
      renderReasons(result.reasons, "❌");
    } else if (result.score >= 20) {
      setUiState("warn", "SUSPICIOUS", `Risk Score: ${result.score}%`);
      renderReasons(result.reasons, "⚠️");
    } else {
      setUiState("safe", "LIKELY SAFE", `Risk Score: ${result.score}%`);
      analysisSection.classList.remove("hidden");
      reasonsList.innerHTML = `
        <li class="reason-item">
          <span class="reason-icon">✅</span>
          <span>No major red flags detected. Always verify sender identity.</span>
        </li>
      `;
    }
  });
});

// ... Keep your setUiState and renderReasons functions below ...
function setUiState(stateClass, title, subtitle) {
  verdictBox.className = "verdict-box"; 
  verdictBox.classList.add(`state-${stateClass}`);
  const icons = { neutral: "🔍", safe: "🛡️", warn: "✋", danger: "🚨" };
  verdictIcon.textContent = icons[stateClass];
  verdictText.textContent = title;
  scoreText.textContent = subtitle;
}

function renderReasons(reasons, iconChar) {
  analysisSection.classList.remove("hidden");
  reasonsList.innerHTML = "";
  if (reasons.length === 0) return;
  reasons.forEach(reason => {
    const li = document.createElement("li");
    li.className = "reason-item";
    li.innerHTML = `<span class="reason-icon">${iconChar}</span><span>${reason}</span>`;
    reasonsList.appendChild(li);
  });
}