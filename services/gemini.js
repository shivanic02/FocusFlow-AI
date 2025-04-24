// services/gemini.js

async function getPersonalizedNudge(fromUrl, toUrl) {
  const prompt = `
You're a friendly productivity assistant.

The user was focused on this site: "${fromUrl}"  
Then they opened this site: "${toUrl}"

Write a short, motivational message (under 30 words) to encourage them to return to the first site. Be warm, encouraging, and supportive.
`;

  console.log("📡 Sending nudge prompt to Gemini...");

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
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    console.log("💬 Gemini nudge:", text || "(fallback)");

    return text || "👋 Quick detour? Ready to get back to what matters?";
  } catch (err) {
    console.error("❌ Gemini API failed:", err);
    return "🌊 Took a scroll break? Let's refocus for a bit.";
  }
}
