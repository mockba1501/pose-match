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
    - NOTE: Angle-based comparison does not require pose normalization.
    - Normalization is kept for future distance-based metrics.
- **Dual-Pipeline**: Separate state management for Reference (Static) and User (Dynamic) poses.
- **Similarity Scoring**:
    - **Joint Angle Analysis**: Computes specific joint angles (shoulders, elbows, hips, knees).
    - **Tolerance Checking**: Compares user angles against reference with configurable tolerance (e.g., ±5°).
- **Visual Feedback**:
    - **Real-time Skeleton Coloring**: Joints change color based on match status (Gray=Idle, Green=Match, Yellow=Close, Red=Miss).


### 🚧 In Progress (Next Steps)
- **Advanced Metrics**: Vector-based cosine similarity for overall body alignment.
- **Textual Feedback UI**: Instructions like "Raise Left Arm" or "Widening Stance".


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
- [x] **Phase 3**: Similarity Scoring Engine (Vector Math & Joint Angles)
- [x] **Phase 4**: User Feedback System (Visual State Feedback)

