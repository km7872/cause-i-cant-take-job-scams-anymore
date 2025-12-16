function extractEmail() {
  let from = "";
  let body = "";
  let senderName = "";

  // Gmail Sender Name & Email
  // .gD is usually the span containing the name/email
  const senderNode = document.querySelector(".gD");
  if (senderNode) {
    from = senderNode.getAttribute("email");
    senderName = senderNode.innerText; // Get the visible name too
  }

  // Gmail Body
  const bodyNode = document.querySelector(".a3s");
  if (bodyNode) body = bodyNode.innerText;

  return { from, body, senderName };
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scan_email") {
    const emailData = extractEmail();
    
    // Check if we actually found data
    if (emailData.from && emailData.body) {
      sendResponse({ success: true, data: emailData });
    } else {
      sendResponse({ success: false });
    }
  }
});