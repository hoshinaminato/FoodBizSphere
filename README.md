# FoodBizSphere

A professional evaluation tool for catering business owners and entrepreneurs to assess shop locations, costs, and profitability.

## 🚀 Features

- **District Management**: Create and manage business districts with detailed field assessment data.
- **Merchant Management**: Track merchants within districts, including costs, revenue, and profitability analysis.
- **Photo Management**: Upload and view field photos for districts and merchants (stored locally in IndexedDB).
- **Data Portability**: Export all your data to a JSON file and import it back anytime.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
- **Interactive UI**: Smooth animations and transitions powered by Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Framer Motion (motion/react)
- **Storage**: IndexedDB (via idb-keyval)
- **Build Tool**: Vite

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hoshinaminato/FoodBizSphere.git
   cd FoodBizSphere
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## 🚢 Deployment

This project is configured for automatic deployment to **GitHub Pages** via GitHub Actions.

1. Push your code to the `main` branch.
2. The [Deploy to GitHub Pages](.github/workflows/deploy.yml) workflow will automatically build and deploy your app to the `gh-pages` branch.
3. In your GitHub repository settings, go to **Pages** and ensure the source is set to the `gh-pages` branch.

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the file for details.

Copyright (c) 2026 [hoshinaminato](https://github.com/hoshinaminato)
