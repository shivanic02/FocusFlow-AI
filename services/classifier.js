// services/classifier.js

async function classifySite(titleOrDomain) {
  const prompt = `
You're a productivity assistant.

Classify the following website as either:
- "focus" (used for work, study, learning, productivity)
- "distraction" (used for entertainment, social media, or time-wasting)

Site: "${titleOrDomain}"

Only respond with one word:
- focus
- distraction
`;

  console.log(`🔍 Classifying: "${titleOrDomain}"`);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();

    console.log("📡 Gemini response:", reply);

    if (["focus", "distraction"].includes(reply)) {
      return reply;
    }

    console.warn("⚠️ Unexpected reply, using fallback.");
    return fallbackKeywordCheck(titleOrDomain);

  } catch (err) {
    console.error("❌ Gemini classification failed:", err);
    return fallbackKeywordCheck(titleOrDomain);
  }
}

// 🛟 Fallback keyword classification
function fallbackKeywordCheck(text) {
  const focusKeywords = ["notion", "khanacademy", "leetcode", "docs", "wikipedia", "coursera", "edx", "github"];
  const distractionKeywords = ["youtube", "reddit", "netflix", "tiktok", "instagram", "twitter"];

  const lower = text.toLowerCase();

  if (focusKeywords.some(k => lower.includes(k))) return "focus";
  if (distractionKeywords.some(k => lower.includes(k))) return "distraction";

  return "neutral";
}
