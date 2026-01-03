import type { PoseLandmark, PoseData } from "@/app/types/poseData";
import { POSE_LANDMARKS } from "./poseLandmarks";

export function computeHipMidPoint(landmarks: PoseLandmark[])
{
    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];

    if( !leftHip || !rightHip || !leftHip.visible || !rightHip.visible)
        return null;

    return {
        x: (leftHip.x + rightHip.x)/2,
        y: (leftHip.y + rightHip.y)/2,
        z: leftHip.z !== undefined && rightHip.z !== undefined
      ? (leftHip.z + rightHip.z) / 2
      : undefined,
    }
}

export function translateLandmarks(
  landmarks: PoseLandmark[],
  anchor: { x: number; y: number; z?: number }
): PoseLandmark[] {
  return landmarks.map(lm => ({
    ...lm,
    x: lm.x - anchor.x,
    y: lm.y - anchor.y,
    z: lm.z !== undefined && anchor.z !== undefined
      ? lm.z - anchor.z
      : lm.z,
  }));
}

export function computeTorsoScale(landmarks: PoseLandmark[]) {
  const hipMid = computeHipMidPoint(landmarks);
  const ls = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rs = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];

  if (!hipMid || !ls || !rs || !ls.visible || !rs.visible) {
    return null;
  }

  const shoulderMid = {
    x: (ls.x + rs.x) / 2,
    y: (ls.y + rs.y) / 2,
  };

  const dx = shoulderMid.x - hipMid.x;
  const dy = shoulderMid.y - hipMid.y;

  const length = Math.sqrt(dx * dx + dy * dy);

  return length > 0 ? length : null;
}

export function scaleLandmarks(
  landmarks: PoseLandmark[],
  scale: number
): PoseLandmark[] {
  return landmarks.map(lm => ({
    ...lm,
    x: lm.x / scale,
    y: lm.y / scale,
    z: lm.z !== undefined ? lm.z / scale : lm.z,
  }));
}

export function normalizePose(pose: PoseData): PoseData {
  const anchor = computeHipMidPoint(pose.landmarks);
  if (!anchor) return pose;

  const translated = translateLandmarks(pose.landmarks, anchor);

  const scale = computeTorsoScale(translated);
  if (!scale) return pose;

  const normalizedLandmarks = scaleLandmarks(translated, scale);

  return {
    ...pose,
    landmarks: normalizedLandmarks,
    anchor: {
      landmarkIndices: [
        POSE_LANDMARKS.LEFT_HIP,
        POSE_LANDMARKS.RIGHT_HIP,
    ],
      x: 0,
      y: 0,
      strategy: "mid_hip",
    },
  };
}