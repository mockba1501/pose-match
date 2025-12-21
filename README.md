# PoseMatch – Real-time Pose Similarity System

**A pure geometric motion-matching system that compares a user’s live camera pose against a static reference pose.**

![Tech Stack](https://img.shields.io/badge/Stack-Next.js_16_App_Router-black) ![Style](https://img.shields.io/badge/Style-Tailwind_CSS_v4-38bdf8) ![Vision](https://img.shields.io/badge/Vision-MediaPipe-orange)

## 🚨 Critical Disclaimer
This system provides **geometric similarity metrics only**. It is **NOT** a medical or fitness tool. It does not evaluate safety, correctness, or health.

---

## 🚀 Features
### ✅ Implemented
- **Reference Pose Visualization**: Select and view reference poses with skeleton overlays.
- **Real-time Camera Detection**:
    - High-performance webcam integration using `requestAnimationFrame` loop.
    - Zero-latency overlay rendering using direct Canvas operations.
    - Robust permission handling and stream management.
- **Pose Normalization**: Geometric normalization (mid-hip centering, torso scaling) ready for comparison logic.
- **Dual-Pipeline**: Separate state management for Reference (Static) and User (Dynamic) poses.

### 🚧 In Progress (Next Steps)
- **Similarity Scoring**: Implementing vector-based cosine similarity to compare Reference vs. User.
- **Visual Feedback**: Real-time color-coding (Green = Match, Red = Miss) based on the score.
- **Feedback UI**: Instructions like "Raise Left Arm" or "Widening Stance".

## 🛠️ Architecture
- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4
- **Vision**: Google MediaPipe (GPU-accelerated)
- **State Management**:
    - **Ref-based Loop**: The detection loop runs outside React's render cycle for performance.
    - **Throttled State**: Only significant pose updates trigger React re-renders.

## 📦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run development server**:
   ```bash
   npm run dev
   ```
3. **Open**: [http://localhost:3000](http://localhost:3000)

## 🗺️ Roadmap
- [x] **Phase 1**: Webcam setup & Static Reference Visualization
- [x] **Phase 2**: Real-time MediaPipe Integration (Video Mode)
- [ ] **Phase 3**: Similarity Scoring Engine (Vector Math)
- [ ] **Phase 4**: User Feedback System (Visual & Text)
