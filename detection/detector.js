/**
 * JOB SCAM DETECTOR - CORE LOGIC
 * Analyzes email content and sender to calculate a risk score.
 */
export function analyzeJobScam(email) {
  let score = 0;
  const reasons = [];

  // Normalize inputs to lower case for comparison
  const body = email.body?.toLowerCase() || "";
  const fromEmail = email.from?.toLowerCase() || "";
  const senderName = email.senderName?.toLowerCase() || ""; // e.g., "Hirewell Hiring Team"
  
  // Extract the part before the @ (e.g., "shelli.bozak.sr.recruiter.ciso")
  const localPart = fromEmail.split('@')[0];
  const domainPart = fromEmail.split('@')[1];

  // ──────────────────────────────────────────────────────────
  // 1. THE "IMPERSONATION" CHECK (Role vs. Domain)
  // ──────────────────────────────────────────────────────────
  const authorityKeywords = [
    "hiring team", "talent acquisition", "recruiter", 
    "hiring manager", "hr department", "human resources", 
    "placement", "staffing", "careers at", "consultant"
  ];

  const freeDomains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
    "aol.com", "icloud.com", "protonmail.com", "mail.com"
  ];

  const claimsAuthority = authorityKeywords.some(keyword => 
    senderName.includes(keyword) || body.includes(` ${keyword} `)
  );

  const isFreeDomain = freeDomains.some(d => domainPart === d);

  if (claimsAuthority && isFreeDomain) {
    score += 80;
    reasons.push("CRITICAL: Sender claims to be a Recruiter/Hiring Team but is using a personal free email (Gmail/Yahoo). Legitimate recruiters ALWAYS use company domains.");
  }

  // ──────────────────────────────────────────────────────────
  // 2. THE "TITLE STUFFING" CHECK (Fixes the CISO email)
  // ──────────────────────────────────────────────────────────
  // Scammers put titles INSIDE the email address to look real
  // e.g., "sr.recruiter.ciso@gmail.com"
  const titleInEmailKeywords = [
    "recruiter", "manager", "director", "ciso", "ceo", "cfo", 
    "cto", "admin", "support", "hiring", "talent", "careers"
  ];

  const embeddedTitle = titleInEmailKeywords.find(title => localPart.includes(title));

  if (embeddedTitle && isFreeDomain) {
    score += 65;
    reasons.push(`Suspicious: The email address itself contains a job title ("${embeddedTitle}"). Real professionals use names (jane.doe@company.com), not titles (recruiter.jane@gmail.com).`);
  }

  // ──────────────────────────────────────────────────────────
  // 3. THE "VAGUENESS" CHECK (Catches the CISO email body)
  // ──────────────────────────────────────────────────────────
  // Real jobs list tools (Python, Salesforce, Excel).
  // Fake jobs list fluff (Innovation, Culture, Growth) to sound good to everyone.
  
  const fluffKeywords = [
    "groundbreaking projects", "shaping the future", "meaningful work",
    "high-impact work", "culture that values", "excellence", 
    "continuous learning", "limitless potential", "rapidly growing"
  ];
  
  const hardSkills = [
    "python", "java", "javascript", "react", "sql", "excel", 
    "salesforce", "jira", "aws", "docker", "figma", "photoshop", 
    "accounting", "nursing", "c++", "marketing", "sales"
  ];

  const fluffCount = fluffKeywords.filter(k => body.includes(k)).length;
  const skillCount = hardSkills.filter(k => body.includes(k)).length;

  // If lots of fluff but ZERO hard skills -> Scam
  if (fluffCount >= 2 && skillCount === 0 && body.length > 200) {
    score += 30;
    reasons.push("Job description is suspiciously vague. It uses many buzzwords ('groundbreaking', 'high-impact') but lists zero specific hard skills or tools.");
  }

  // ──────────────────────────────────────────────────────────
  // 4. THE "RESUME HARVESTING" CHECK
  // ──────────────────────────────────────────────────────────
  // Catches: "Please share... your most recent resume"
  
  // Regex to catch "send/share/forward" followed closely by "resume/cv"
  const harvestRegex = /(share|send|forward|provide).{0,30}(resume|cv|bio|details|application)/i;

  // Check if they ask for this via email reply instead of a link
  if (harvestRegex.test(body) && !body.includes("http")) {
    score += 25;
    reasons.push("Sender asks you to reply with your Resume/CV directly via email instead of linking to an official application portal. This is a common data harvesting tactic.");
  }

  // ──────────────────────────────────────────────────────────
  // 5. THE "SOCIAL SCRAPER" CHECK
  // ──────────────────────────────────────────────────────────
  if ((body.includes("saw your comment") || body.includes("across your comment")) && body.includes("post")) {
    score += 20;
    reasons.push("Reference to 'seeing your comment' on a post. This is a common script used to feign a personal connection.");
  }

  // ──────────────────────────────────────────────────────────
  // 6. TYPOSQUATTING CHECK
  // ──────────────────────────────────────────────────────────
  const typoPatterns = [/hiir/i, /hireing/i, /carrer/i, /suup/i, /serviice/i];
  if (typoPatterns.some(regex => regex.test(localPart))) {
    score += 30;
    reasons.push(`Suspicious typo detected in email address: "${localPart}".`);
  }

  let scorePercent = Math.round((score/250)*100)

  return { 
    isScam: scorePercent > 50,
    score: scorePercent,
    reasons: reasons 
  };
}