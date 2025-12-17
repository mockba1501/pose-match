// Type Definitions for: landmarks, PoseLandmarkerResult, internal normalized landmarks
// Source: useMediaPipePoseDetector hook, PoseDetector component

export interface PoseLandmark {
  /** Stable landmark index (0–32 for BlazePose) */
  index: number;

  /** Coordinate space (raw or normalized depending on pipeline stage) */
  x: number;
  y: number;
  z?: number;

  /** Visibility score extracted from model output */
  visibility: number;

  /** Convenience flag based on visibility threshold */
  visible: boolean;
}

export interface PoseAnchor {
  /** Which landmarks were used to compute the anchor */
  landmarkIndices: number[];

  /** Anchor position in pose space */
  x: number;
  y: number;
  z?: number;

  /** Strategy used */
  strategy:
    | "mid_hip"
    | "mid_shoulder"
    | "torso_centroid"
    | "confidence_weighted_centroid";
}

export interface PoseData {
  /** Versioned internal pose contract */
  version: "v1";

  /** All pose landmarks (fixed length for BlazePose: 33) */
  landmarks: PoseLandmark[];

  /** Optional derived anchor */
  anchor?: PoseAnchor;

  /** Overall pose confidence (aggregated) */
  confidence: number;

  /** Metadata for traceability */
  metadata: {
    source: "mediapipe";
    model: "blazepose";
    timestamp: number;
    imageSize?: {
      width: number;
      height: number;
    };
  };
}
