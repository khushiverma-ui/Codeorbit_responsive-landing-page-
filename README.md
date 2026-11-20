# 🚀 CodeOrbit — College Skill Exchange Platform (CSEP)

<div align="center">

**Learn • Share • Collaborate • Grow Together**

[![Firebase Ready](https://img.shields.io/badge/Firebase-v10_Modular_SDK-FFCA28?logo=firebase&logoColor=black)](#-firebase-backend-architecture)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5_%7C_CSS3_%7C_ES6_Modules-38BDF8?logo=javascript&logoColor=white)](#-technologies-used)
[![Design System](https://img.shields.io/badge/UI%2FUX-Custom_Purple_Design_System-7C3AED)](#-uiux-design-system)
[![Status](https://img.shields.io/badge/Production-Ready-10B981)](#-production-directory-structure)

*A peer-to-peer reciprocal skill exchange & collaborative project ecosystem tailored for college campus communities.*

[Live Local Server](http://localhost:5500) • [Explore Pages](#-application-pages) • [Firebase Setup](#-firebase-backend-architecture) • [PPT References](#-references--citations-for-presentation)

</div>

---

## 🌟 Overview

**CodeOrbit (CSEP)** solves the challenge of siloed student learning on college campuses. Instead of expensive courses or unilateral tutoring, CodeOrbit provides a **barter-based, peer-to-peer exchange**: teach what you know (e.g., React, UI/UX, Flutter) and learn what you need (e.g., DSA, Machine Learning, Node.js) directly with peers from your college.

### ✨ Key Capabilities
1. **Interactive Hero Section:** Orbital `</>` branding with tagline, fluid wave dividers, and custom high-definition student collaboration artwork.
2. **Peer Skill Match & Swap:** Direct reciprocal exchange matching student skills with instant proposal modal and filterable match cards.
3. **Google Firebase Authentication:** Seamless "Continue with Google" popup authentication and Email/Password flow with persistent user state.
4. **Cloud Firestore Collections:** Production-structured database schema for users, skill sessions, barter swaps, collaborative projects, and community discussions.
5. **Modern Production Architecture:** Clean separation of concerns with `assets/css/`, `assets/js/`, `assets/images/`, and modular ES6 JavaScript.

---

## 📁 Production Directory Structure

The repository is organized following clean production standards:

```
vexor-os/
├── index.html                   # Landing Page (Hero, Value Props, Stats, CTAs)
├── dashboard.html               # Student Dashboard (Khushi Verma, Progress, Metrics)
├── skill-match.html             # Peer Skill Match & Swap (Reciprocal Barter Engine)
├── skills.html                  # Explore Skills Catalog & Search
├── skill-details.html           # Skill Session Detail & Join Page
├── projects.html                # Project Collaboration Space & Team Finder
├── community.html               # Campus Community Discussions & Threads
├── profile.html                 # Student Profile Page (Khushi Verma)
├── login.html                   # Login (Google Sign-In + Email/Password)
├── register.html                # Student Registration with Skill Selection
├── registration-success.html    # Onboarding Confirmation & Quick Links
│
├── assets/
│   ├── css/                     # Production Modular Stylesheets
│   │   ├── design-system.css    # Global Color Palette, Typography & Tokens
│   │   ├── index.css            # Landing Page Styles
│   │   ├── dashboard.css        # Dashboard & Metrics Layout
│   │   ├── skill-match.css      # Skill Match & Swap Modal Styles
│   │   ├── skills.css           # Explore Skills Catalog Grid
│   │   ├── skill-details.css    # Skill Detail View Layout
│   │   ├── projects.css         # Collaboration Projects Layout
│   │   ├── community.css        # Discussion Feed & Threads
│   │   ├── profile.css          # Profile & Badges Layout
│   │   └── auth.css             # Login & Register Forms
│   │
│   ├── js/                      # Production ES6 JavaScript Modules
│   │   ├── firebase-config.js   # Firebase v10 Modular SDK Initialization & Exports
│   │   ├── firebase-auth.js     # Google Sign-In, Auth State & User Provisioning
│   │   ├── firebase-db.js       # Cloud Firestore CRUD (Swaps, Projects, Discussions)
│   │   ├── auth.js              # Auth UI Controller (Google Sign-In & Forms)
│   │   ├── index.js             # Landing Page Interactivity
│   │   ├── dashboard.js         # Student Dashboard State & Storage Sync
│   │   ├── skill-match.js       # Peer Match Filter & Swap Proposal Handler
│   │   ├── skills.js            # Explore Skills Search & Category Filters
│   │   ├── skill-details.js     # Dynamic Skill Session Loader
│   │   ├── projects.js          # Project Creation & Team Join Handler
│   │   ├── community.js         # Discussion Thread Poster & Like System
│   │   ├── profile.js           # Student Profile Editor & Stats Sync
│   │   └── registration-success.js # Post-Registration Redirects
│   │
│   └── images/
│       └── hero-illustration.jpg # High-Definition Student Collaboration Hero Artwork
│
├── firebase.json                # Firebase Hosting & Firestore Rules Configuration
├── firestore.rules              # Production Cloud Firestore Security Rules
├── .firebaserc                  # Firebase Project Target Configuration
├── package.json                 # Project Metadata, Scripts & NPM Tooling
└── README.md                    # Project Documentation & Architecture
```

---

## 🔥 Firebase Backend Architecture

CodeOrbit is powered by **Google Firebase v10 Modular SDK** with a graceful offline/demo fallback mechanism:

### 1. Authentication Services (`assets/js/firebase-auth.js`)
- **Google Sign-In:** One-click Google popup authentication using Firebase `GoogleAuthProvider`. Automatically provisions new student documents in Firestore.
- **Email & Password Authentication:** Standard registration with academic profile fields (college, course, year, offer skills, wanted skills) and login authentication.
- **Auth State Observer:** `onAuthStateChanged` syncs user session in real-time across browser tabs.

### 2. Cloud Firestore Database Schema (`assets/js/firebase-db.js`)
- `users/{uid}`: Student profile, college affiliation, skills offered, skills wanted, stats.
- `swaps/{swapId}`: Skill swap proposals between students with reciprocal barter details and status (`pending`, `accepted`, `completed`).
- `projects/{projectId}`: Collaborative student projects seeking teammates with tags and open roles.
- `discussions/{discussionId}`: Campus community threads, questions, answers, and likes.

### 3. Production Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    match /swaps/{swapId} {
      allow read, write: if request.auth != null;
    }
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /discussions/{discussionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Connecting Your Own Firebase Console Project
To connect your own Firebase project credentials:
1. Visit the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Authentication** (Google Provider & Email/Password).
3. Create a **Cloud Firestore** database.
4. Replace the values in `assets/js/firebase-config.js`:
```javascript
export const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```
*(If left as default demo credentials, the app gracefully runs in interactive demo mode using browser state).*

---

## 🎨 UI/UX Design System

The visual design is built with a cohesive, modern college developer aesthetic:

| Token | Hex Value | Role |
|---|---|---|
| **Primary Purple** | `#7C3AED` | Primary brand accent, primary CTA buttons, active state |
| **Secondary Violet** | `#6366F1` | Hero gradients, secondary buttons, tags |
| **Light Lavender** | `#A78BFA` | Subtle borders, light highlights, tags |
| **Soft Lavender Tint** | `#F3E8FF` | Badge backgrounds, card subtle glow |
| **Dark Header/Sidebar** | `#0F172A` | Hero background, sidebar contrast |
| **Surface Background** | `#F8FAFC` | Light mode app body background |
| **Card Surface** | `#FFFFFF` | Elevated card surfaces, crisp drop-shadows |

---

## 📑 Application Pages

| # | Page | File | Description |
|---|---|---|---|
| 01 | **Landing Page** | `index.html` | Hero section with orbital branding, value props, statistics, and quick navigation. |
| 02 | **Student Dashboard** | `dashboard.html` | Overview of learning progress, upcoming peer sessions, active collaborations, and metrics for **Khushi Verma**. |
| 03 | **Skill Match & Swap** | `skill-match.html` | Reciprocal barter matching engine with filters (Web Dev, AI/ML, Design) and propose swap modal. |
| 04 | **Explore Skills** | `skills.html` | Catalog of campus skill sessions with search and category tags. |
| 05 | **Skill Details** | `skill-details.html` | Deep dive into specific session agendas, mentor details, and one-click join. |
| 06 | **Student Projects** | `projects.html` | Collaborative campus projects seeking teammates with role tags and open positions. |
| 07 | **Campus Community** | `community.html` | Discussion forum for asking queries, sharing advice, and academic networking. |
| 08 | **Student Profile** | `profile.html` | Student profile for **Khushi Verma** (`KV`), showing shared skills, badges, and activity. |
| 09 | **Sign In** | `login.html` | "Continue with Google" popup button + Email/Password form. |
| 10 | **Sign Up** | `register.html` | Comprehensive onboarding with college, course, year, and skill preferences. |
| 11 | **Registration Success** | `registration-success.html` | Confirmation with links to Dashboard and Explore Skills. |

---

## 🔗 References & Citations (For Presentation & PPT)

The following references and documentation sources were utilized in designing and building the CodeOrbit platform:

| Source | Topic | Official Reference URL |
|---|---|---|
| 📖 **Web Development Documentation** | MDN Web Docs – HTML, CSS, and JavaScript standards & APIs | [https://developer.mozilla.org/](https://developer.mozilla.org/) |
| 🌐 **W3C Standards** | World Wide Web Consortium – Web standards, accessibility, and best practices | [https://www.w3.org/](https://www.w3.org/) |
| 🐙 **GitHub Documentation** | Version control, team collaboration workflows, and project hosting | [https://docs.github.com/](https://docs.github.com/) |
| 🎨 **UI/UX Design References** | UX Design principles, usability heuristics, and user experience guidelines | [https://uxdesign.cc/](https://uxdesign.cc/) |
| 🎓 **Research Articles & Blogs** | Google Scholar – Peer-to-peer learning models and skill-sharing paradigms | [https://scholar.google.com/](https://scholar.google.com/) |
| 💡 **Inspiration & Similar Platforms** | Pedagogical and architectural references from leading learning platforms (Coursera, edX, LinkedIn Learning) | [https://www.coursera.org/](https://www.coursera.org/) |

---

## 💻 How to Run the Project

### Option A: Local Development Server (Recommended)
1. Open PowerShell or Terminal in the project root:
   ```powershell
   python -m http.server 5500
   ```
2. Open your browser to:
   ```
   http://localhost:5500
   ```

### Option B: VS Code Live Server
1. Open the project folder in VS Code.
2. Right-click `index.html` and click **"Open with Live Server"**.

### Option C: Deploy to Firebase Hosting
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login and deploy:
   ```bash
   firebase login
   firebase deploy
   ```

---

## 👩‍💻 Author & Credits

- **Developer:** **Khushi Verma**
- **Program:** B.Tech Computer Science & Engineering
- **Institution:** Vidya University
- **Project:** CodeOrbit — College Skill Exchange Platform (CSEP)
- **Role:** Full-Stack & UI/UX Developer
