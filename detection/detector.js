export function heuristicScore(email) {
  let score = 0;
  const reasons = [];

  const text = email.body.toLowerCase();

  // Free email domains
  if (email.from && email.from.includes("@gmail.com")) {
    score += 20;
    reasons.push("Sender uses a free email address.");
  }

  // Urgency words
  if (/urgent|immediately|asap|act now/.test(text)) {
    score += 10;
    reasons.push("Email uses urgency pressure tactics.");
  }

  // Requests for personal info
  if (/ssn|social security|password|bank|gift card|credit card/.test(text)) {
    score += 30;
    reasons.push("Requests sensitive information.");
  }

  return { score, reasons };
}
