# 🚀 FocusFlow — Your AI-Powered Productivity Partner

**🏆 1st Place Winner | Innovation Hacks 2025 @ Arizona State University**

FocusFlow is an intelligent Chrome extension designed to keep users focused and motivated while browsing. Built using agentic workflows and powered by **Gemini 1.5 Pro**, it monitors distraction patterns, delivers personalized nudges, and turns your daily focus into a streak-building game — complete with badges, rewards, and aesthetic themes.

---

## 🌟 Features

- 🧠 **AI-Powered Nudges**  
  Uses **Gemini 1.5 Pro** to generate motivational, context-aware nudges when you drift to distraction sites.

- ⏱️ **Drift Detection & Smart Redirection**  
  Automatically detects when you leave a focus site. After a delay, it prompts you to return and rewards your comeback.

- 🎖️ **Gamified Motivation**  
  Tracks your **FocusPoints**, **daily streaks**, and **badges** like "Back on Track Boss", "Streak Streaker", and more.

- 🎨 **Customizable Themes**  
  Choose from themes like *Calm Lavender*, *Forest Moss*, *Deep Night*, and more. Themes adapt button styles and contrast to your selection.

- 💬 **Encouragement on Every Comeback**  
  When you return to your task, you're greeted with a celebratory pop-up and animated feedback.

---

## 🛠️ Tech Stack

- **Chrome Extensions API**
- **JavaScript (Vanilla)**
- **Gemini 1.5 Pro API** (via `gemini.js` agent)
- **LocalStorage** for user history and rewards
- **HTML/CSS** for custom UI and animated themes

---

## 📁 Folder Structure
FocusFlow/ ├── manifest.json ├── popup.html ├── popup.js ├── background.js ├── services/ │ ├── gemini.js # Gemini 1.5 Pro integration │ ├── classifier.js # Site classification logic │ └── config.js # API keys/configs (if any) ├── styles/ │ └── popup.css # Optional: extracted styles ├── icons/ │ └── icon128.png # Extension icon └── README.md

---

## 🚀 Installation

Follow these steps to install and run the FocusFlow Chrome Extension locally:

1. Clone the repository

    git clone https://github.com/your-username/focusflow.git
    cd focusflow

2. Add your Gemini API Key
     
    💡 FocusFlow uses Gemini 1.5 Pro to generate intelligent nudges and motivational messages.
    To enable this, you'll need to provide your Gemini API key.

- Open the file:
  
  /services/config.js

- Replace the placeholder with your actual API key:
  
  const GEMINI_API_KEY = "your-api-key-here";

3. Open Google Chrome and go to:

     chrome://extensions/

4. Enable Developer Mode

     Toggle the switch in the top right corner.

6. Click on "Load unpacked"
   
     Select the root folder of the cloned repository (the one containing manifest.json).

6. You're done! 🎉
   
    You should now see the FocusFlow extension icon in your Chrome toolbar. Click on it to explore your streaks, earn badges, and stay           focused with personalized nudges powered by Gemini 1.5 Pro.

---

## 👩‍💻 Team Members

- **Shivani Chauhan**  
- **Nishtha Wagh**  
- **Shreyas Hingmire**
