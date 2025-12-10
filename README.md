# 🎌 AniMigo

## Your friendly companion for tracking anime and manga

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-5D8FDD.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Angular](https://img.shields.io/badge/Angular-20-F29079?logo=angular)](https://angular.dev)
[![Ionic](https://img.shields.io/badge/Ionic-8-7EA8E8?logo=ionic)](https://ionicframework.com)
[![AniList](https://img.shields.io/badge/Powered%20by-AniList-5D8FDD)](https://anilist.co)

[Live Demo](https://animigo.netlify.app) • [Report Bug](https://github.com/reky0/AniMigo/issues) • [Request Feature](https://github.com/reky0/AniMigo/issues)

---

## 📖 About AniMigo

**AniMigo** is a modern, cross-platform client for [AniList](https://anilist.co) that brings a smooth and intuitive experience to tracking your anime and manga journey. Built with Angular and Ionic, AniMigo offers a seamless experience across web, progressive web app (PWA), and native Android platforms.

Whether you're discovering seasonal anime, tracking your reading progress, or exploring new titles, AniMigo provides a clean and responsive interface with thoughtful design touches that make browsing and managing your collection a pleasure.

### 🎨 Design Philosophy

AniMigo features a carefully crafted color palette that balances professionalism with approachability:

- **Soft Blue** (`#5D8FDD`) - Primary brand color for a calming, trustworthy feel
- **Warm Coral** (`#F29079`) - Secondary accent for highlights and interactions
- **Sky Blue** (`#7EA8E8`) - Tertiary color for subtle emphasis

The interface is designed to be gentle on the eyes while maintaining visual clarity and hierarchy, making long browsing sessions comfortable.

---

## ✨ Features

### 📺 Browse & Discover

- **Seasonal Anime** - Stay up-to-date with the latest anime releases each season
- **Top Ranked** - Explore the highest-rated anime and manga of all time
- **Trending Now** - Discover what's popular in the community
- **Advanced Search** - Filter by genre, format, status, year, and more
- **Airing Schedule** - Never miss an episode with the weekly schedule view

### 📚 Track Your Collection

- **Media Lists** - Manage your watching, reading, completed, and planned titles
- **Progress Tracking** - Update episode/chapter progress with a single tap
- **Custom Scores** - Rate your titles (supports multiple scoring formats)
- **Reading Notes** - Add personal notes to each entry
- **Quick Actions** - Instantly add to planning, mark as completed, or start watching

### 👤 Profile & Stats

- **Personal Statistics** - View detailed stats on your anime and manga consumption
- **Favorites Management** - Curate your favorite anime, manga, characters, and staff

### 🔍 Detailed Information

- **Rich Media Details** - Comprehensive information including synopsis, scores, and rankings
- **Character Database** - Explore characters with voice actors and appearances
- **Staff Listings** - Discover creators, directors, and production staff
- **Recommendations** - Find similar titles based on your favorites
- **External Links** - Quick access to streaming platforms and related sites

### 🌐 Platform Support

- **Progressive Web App (PWA)** - Install directly from your browser with offline capabilities
- **Responsive Design** - Optimized for mobile, tablet, and desktop viewing

### 🔐 Authentication

- **AniList OAuth** - Secure login with your AniList account
- **Seamless Sync** - All your data stays synchronized with AniList
- **Privacy First** - No data collection beyond what AniList provides

### 🌍 Language Support

- **Currently**: English only
- **Coming Soon**: Spanish translation in development

---

## 🚀 Getting Started

### Prerequisites

Before building AniMigo from source, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Android Studio** (for Android builds) - [Download](https://developer.android.com/studio)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/reky0/AniMigo.git
   cd AniMigo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   The project includes environment files for development and production. The default configuration uses localhost for development.
   
   - Development: `src/environments/environment.ts`
   - Production: `src/environments/environment.prod.ts`

   If you need custom AniList OAuth credentials for development:
   - Register your app at [AniList Settings](https://anilist.co/settings/developer)
   - Update the client IDs in the environment files

---

## 🔨 Building & Running

### Web Development Server

Run the development server with hot-reload:

```bash
npm start
```

Navigate to `http://localhost:8100/` in your browser. The app will automatically reload when you make changes to the source files.

### Production Build (Web)

Build the optimized production bundle:

```bash
npm run build:prod
```

The build artifacts will be stored in the `www/` directory, ready for deployment.

### Progressive Web App (PWA)

AniMigo is PWA-ready out of the box. The production build includes:
- Service worker for offline functionality
- Web manifest for installation
- Optimized caching strategies

Simply deploy the `www/` directory to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

### Android App

#### Development

Run on a connected Android device or emulator with live reload:

```bash
npm run start:android:live
```

#### Production Build

1. **Build the web assets**
   ```bash
   npm run build:prod
   ```

2. **Sync with Capacitor**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**
   ```bash
   npm run open:android
   ```

4. **Build APK/AAB**
   - In Android Studio: `Build > Build Bundle(s) / APK(s)`
   - Or use Gradle directly:
     ```bash
     cd android
     ./gradlew assembleRelease  # For APK
     ./gradlew bundleRelease    # For AAB (Google Play)
     ```

The signed APK will be located at `android/app/build/outputs/apk/release/`.

---

## 📂 Project Structure

```
AniMigo/
├── src/
│   ├── app/
│   │   ├── components/      # UI components (Atomic Design pattern)
│   │   │   ├── atoms/       # Basic building blocks
│   │   │   ├── molecules/   # Simple component groups
│   │   │   ├── organisms/   # Complex UI sections
│   │   │   ├── pages/       # Route-level page components
│   │   │   └── core/        # Core services and utilities
│   │   ├── models/          # TypeScript interfaces and GraphQL queries
│   │   ├── helpers/         # Utility functions
│   │   ├── tabs/            # Tab navigation structure
│   │   └── app.routes.ts    # Application routing
│   ├── assets/              # Static assets (images, icons)
│   ├── environments/        # Environment configuration
│   └── theme/               # Global styles and theme variables
├── android/                 # Android native platform
├── www/                     # Production build output
└── capacitor.config.ts      # Capacitor configuration
```

### Tech Stack

- **Framework**: Angular 20 (Standalone Components)
- **UI Library**: Ionic 8
- **Mobile Runtime**: Capacitor 7
- **GraphQL Client**: Apollo Angular
- **Styling**: SCSS with Ionic Variables
- **Build Tool**: Angular CLI
- **Package Manager**: npm

---

## 🧪 Testing

Run the unit test suite:

```bash
npm test
```

Run linting to check code quality:

```bash
npm run lint
```

---

## 📜 License & Attribution

### License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

**You are free to:**
- ✅ Share — copy and redistribute the material in any medium or format
- ✅ Adapt — remix, transform, and build upon the material

**Under the following terms:**
- 📝 **Attribution** — You must give appropriate credit to the original author ([reky0](https://github.com/reky0)), provide a link to the license, and indicate if changes were made
- 🚫 **NonCommercial** — You may not use the material for commercial purposes without explicit permission
- 🔄 **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license

For the full license text, see [LICENSE](LICENSE) or visit [creativecommons.org/licenses/by-nc/4.0/](https://creativecommons.org/licenses/by-nc/4.0/).

### Data Attribution

This application uses data from **[AniList](https://anilist.co)** under their [Terms of Service](https://anilist.co/terms). AniList is a fantastic community-driven platform for anime and manga tracking, and we're grateful for their public API.

**Please note:**
- All anime and manga data, including titles, descriptions, cover images, and statistics, are provided by AniList
- Character and staff information is sourced from the AniList database
- User data requires authentication through AniList OAuth and remains synchronized with your AniList account

AniMigo is an **unofficial third-party client** and is not affiliated with, endorsed by, or officially connected to AniList in any way.

### Additional Credits

- **Icons**: [Ionicons](https://ionic.io/ionicons) by Ionic Team
- **Fonts**: System fonts with fallbacks for optimal performance
- **Illustrations**: Character illustration in the brand design by original artists on AniList

---

## 🤝 Contributing

Contributions are welcome and appreciated! Whether it's bug reports, feature requests, or code contributions, your input helps make AniMigo better for everyone.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style

- Follow the existing code style and conventions
- Use meaningful variable and function names
- Write clear commit messages
- Add comments for complex logic

### Reporting Issues

Found a bug or have a suggestion? Please [open an issue](https://github.com/reky0/AniMigo/issues) with:
- A clear description of the problem or suggestion
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

---

## 🗺️ Roadmap

### Upcoming Features

- 📱 **Android Native App** - Full native experience with deep linking and system integration
- 🌐 **Spanish Translation** - Full app localization
- 🔔 **Notifications** - Airing episode reminders
- 🎨 **Theme Customization** - Custom color schemes

### Long-term Goals

- Social features (activity feed, user interactions)
- Offline mode enhancements
- 🍎 **iOS Support** - Native iOS application

---

## 💬 Support & Community

- **Questions?** Open a [discussion](https://github.com/reky0/AniMigo/discussions)
- **Bug reports** Use the [issue tracker](https://github.com/reky0/AniMigo/issues)
- **Feature requests** Share your ideas in [issues](https://github.com/reky0/AniMigo/issues)

---

## 🙏 Acknowledgments

Special thanks to:
- The **AniList** team for their excellent API and platform
- The **Ionic** and **Angular** communities for their frameworks and support
- Everyone who has contributed to making AniMigo better
- You, for checking out this project!

---

**Made with 💙 by [reky0](https://github.com/reky0)**

If you find AniMigo useful, consider giving it a ⭐ on GitHub!

[⬆ Back to Top](#-animigo)
