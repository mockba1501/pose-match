# PoseMatch – Real-time Pose Similarity System

**A pure geometric motion-matching system that compares a user’s live camera pose against a static reference pose and computes similarity metrics.**

![Tech Stack](https://img.shields.io/badge/Stack-Next.js_15_App_Router-black) ![Style](https://img.shields.io/badge/Style-Tailwind_CSS-38bdf8) ![Vision](https://img.shields.io/badge/Vision-MediaPipe-orange)

## 🚨 Critical Disclaimer: What this is NOT
To ensure clarity on liability and scope, this system explicitly **DOES NOT** provide:
- ❌ Medical diagnosis or health analysis
- ❌ Exercise recommendations or coaching
- ❌ "Correctness" or safety evaluations
- ❌ Biometric health analytics

**This system measures geometric similarity, not pose quality.**

---

## 🚀 Features (Planned)
- **Real-time Capture**: High-performance webcam integration.
- **Pose Detection**: Client-side landmark extraction using Google MediaPipe.
- **Geometric Scoring**: Compute similarity based on vector angles (invariant to distance/scale), not just raw coordinates.
- **Visual Feedback**: Real-time skeleton overlay with color-coded deviation indicators.
- **Privacy First**: All processing happens locally in the browser; video feeds are never sent to a server.

## 🛠️ Architecture

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Vision Engine**: MediaPipe Pose / TensorFlow.js
- **Rendering**: React Canvas / SVG Overlays

### Backend (Future Phase)
- **Database**: PostgreSQL (for storing reference poses & session metadata)
- **API**: Next.js Server Actions / API Routes

## 📦 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗺️ Roadmap
- [ ] **Phase 1**: Webcam setup & MediaPipe integration (Client-side)
- [ ] **Phase 2**: Basic similarity scoring algorithm
- [ ] **Phase 3**: UI polishing & Visual Feedback
- [ ] **Phase 4**: Backend integration for reference pose storage
