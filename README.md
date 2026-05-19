# DevPath India Community Website

<p align="center">
  <img src="public/logo.png" alt="DevPath Logo" width="250"/>
</p>

<p align="center">
  <a href="https://github.com/devpathindcommunity-india/DevPath-Web/graphs/contributors"><img src="https://img.shields.io/github/contributors/devpathindcommunity-india/DevPath-Web.svg?style=for-the-badge" alt="Contributors"></a>
  <a href="https://github.com/devpathindcommunity-india/DevPath-Web/network/members"><img src="https://img.shields.io/github/forks/devpathindcommunity-india/DevPath-Web.svg?style=for-the-badge" alt="Forks"></a>
  <a href="https://github.com/devpathindcommunity-india/DevPath-Web/stargazers"><img src="https://img.shields.io/github/stars/devpathindcommunity-india/DevPath-Web.svg?style=for-the-badge" alt="Stargazers"></a>
  <a href="https://github.com/devpathindcommunity-india/DevPath-Web/issues"><img src="https://img.shields.io/github/issues/devpathindcommunity-india/DevPath-Web.svg?style=for-the-badge" alt="Issues"></a>
  <a href="https://github.com/devpathindcommunity-india/DevPath-Web/blob/main/LICENSE"><img src="https://img.shields.io/github/license/devpathindcommunity-india/DevPath-Web.svg?style=for-the-badge" alt="License"></a>
</p>

<p align="center">
  Welcome to the official repository for the <b>DevPath India Community Website</b>. This platform is designed to foster collaboration, share resources, manage events, and connect developers within the DevPath India community. Built with the latest web technologies, it offers a modern, responsive, and interactive user experience.
</p>

<br />

## 📑 Table of Contents

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🏁 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [🔥 Local Firebase Configuration](#-local-firebase-configuration)
- [📜 Scripts](#-scripts)
- [🤝 Contributing](#-contributing)
- [💖 Code of Conduct](#-code-of-conduct)
- [📄 License & Brand Protection](#-license--brand-protection)
- [🌟 Major Contributors](#-major-contributors)

---

## 🚀 Features

- **Community Hub**: Connect with fellow developers, mentors, and team members.
- **Event Management**: Stay updated with upcoming hackathons, workshops, and meetups.
- **Resource Library**: Access curated learning paths, tutorials, and documentation.
- **Wiki & Knowledge Base**: Comprehensive guides and community-contributed articles.
- **User Profiles**: Showcase your contributions, skills, and community activity.
- **Open Source**: A platform built by the community, for the community.

## 🛠️ Tech Stack

This project leverages a modern and powerful technology stack:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://greensock.com/gsap/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: [ESLint](https://eslint.org/)

## 📸 Screenshots

| Home Page | Community |
| :---: | :---: |
| <img src="public/screenshot-home.png" alt="Home Page" height="250"/> | <img src="public/screenshot-community.png" alt="Community" height="250"/> |

## 🏁 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devpathindcommunity-india/DevPath-Web.git
   cd DevPath-Web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Environment Variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and fill in your Firebase credentials.

### 🔥 Local Firebase Configuration

To run this project locally, you'll need your own Firebase project:

1. **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Enable Services**:
   - **Authentication**: Enable Email/Password or Google provider.
   - **Firestore**: Create a database in test mode (or apply the rules in `firestore.rules`).
3. **Register a Web App**: Add a "Web App" to your Firebase project to get your configuration object.
4. **Fill `.env.local`**: Copy the values from your Firebase config object into your `.env.local` file.
5. **Install Firebase CLI**: 
   ```bash
   npm install -g firebase-tools
   ```
6. **Login & Use Project**:
   ```bash
   firebase login
   firebase use --add <your-project-id>
   ```

> [!CAUTION]
> **Security Reminder**: Never commit your `.env.local` file. It contains sensitive keys that should remain private to your local environment.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

### 🚀 Firebase Hosting Deployment

To deploy the production-ready site directly to Firebase Hosting:

1. **Build the production static export**:
   This compiles the Next.js App Router files into highly optimized static assets inside the `out/` directory:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:
   Deploy the build files along with custom Firestore indexes and rules to the live platform:
   ```bash
   npx firebase deploy
   ```

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get started. Don't forget to check our [good first issues](https://github.com/devpathindcommunity-india/DevPath-Web/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) if you're looking for a place to start!

## 💖 Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License & Brand Protection

This project is licensed under a custom **DevPath India Source-Available License**. See the [LICENSE](LICENSE) file for full details.

> [!WARNING]
> **Important Licensing Terms:**
> - You **may** clone, run, and modify this code locally to learn or submit contributions.
> - You **may NOT** use this software for commercial purposes or host it publicly as a competing platform/clone.
> - The **"DevPath India"** name, logos, and brand identity are strictly copyrighted and trademarked. They cannot be used in derivative works without explicit permission.

---

<p align="center">
  Built with ❤️ by the DevPath India Community.
</p>

## 🌟 Major Contributors

- **Aditya948351** - Core Maintainer & Lead Developer
