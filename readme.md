Prysa - PRivacY-first Scam Analyzer
Prysa is a lightweight, privacy-focused Chrome Extension that detects potential job scams and recruiter impersonation in Gmail. It analyzes email headers and content entirely within your browser—no data ever leaves your device.

Features
Zero-Knowledge Architecture: Runs 100% locally. No API keys, no external servers, and no data tracking.
Impersonation Detection: Flags emails claiming to be "Hiring Managers" or "Recruiters" sent from free domains (e.g., @gmail.com, @yahoo.com).
Title Stuffing Check: Detects suspicious emails where job titles are embedded in the email address itself (e.g., sr.recruiter.amazon@gmail.com).
Content Analysis: Scans for "fluff" keywords vs. hard skills to identify vague, copy-pasted scam templates.
Resume Harvesting Protection: Warns if a sender requests a resume via direct email reply instead of a secure application link.

🛠️ Installation (Developer Mode)
Since this is a local project, you can install it directly into Chrome:
Clone this repository or download the ZIP.
Open Chrome and navigate to chrome://extensions/.
Toggle Developer mode in the top-right corner.
Click Load unpacked.
Select the folder containing manifest.json.

📖 How to Use
Open Gmail in your browser.
Open an email you want to check.
Click the Prysa icon in your browser toolbar.
Instant analysis! The popup will show a risk score:
✅ Likely Safe: No major red flags found.
⚠️ Suspicious: Potential risk factors detected (Score > 20%).
🚨 High Risk Scam: Critical warning signs (Score > 50%).

🔒 Privacy Policy
Prysa does not collect user data.
Internet access (mail.google.com) is used solely to read the active email content for local analysis.
Analysis results are discarded immediately after the popup is closed.
No analytics or tracking scripts are included.

💻 Tech Stack
Manifest V3 (Modern Chrome Extension Standard)
Vanilla JavaScript
HTML/CSS

Feedback? Found a bug or have a suggestion? Feel free to open an issue.