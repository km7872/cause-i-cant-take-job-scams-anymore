function extractEmail() {
  let from = "";
  let body = "";

  // Gmail sender
  const senderNode = document.querySelector(".gD");
  if (senderNode) from = senderNode.getAttribute("email");

  // Gmail body
  const bodyNode = document.querySelector(".a3s");
  if (bodyNode) body = bodyNode.innerText;

  return { from, body };
}

// Observe Gmail DOM for email content
const targetNode = document.querySelector("body"); // observe whole body
const observerConfig = { childList: true, subtree: true };

const observer = new MutationObserver(() => {
  const email = extractEmail();

  // Only save if we have some content
  if (email.body && email.from) {
    chrome.storage.local.set({ lastEmail: email });
  }
});

observer.observe(targetNode, observerConfig);
