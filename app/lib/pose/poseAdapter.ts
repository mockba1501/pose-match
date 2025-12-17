import type { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import type {PoseLandmark, PoseData} from '../../types/poseData';
const VISIBILITY_THRESHOLD = 0.5;

const poseAdapter = (poseLandmarkerResult: PoseLandmarkerResult, width:number, height:number) => {
    if(poseLandmarkerResult.landmarks.length === 0)
        return null;

    const visibilityArray = poseLandmarkerResult.landmarks[0].map(landmark => landmark.visibility ?? 0);
    const confidence = visibilityArray.length === 0 ? 0 : visibilityArray.reduce((sum, v) => sum + v,0) / visibilityArray.length;

    const poseData: PoseData = {

      version: "v1",
    
      /** All pose landmarks (fixed length for BlazePose: 33) */
      landmarks: poseLandmarkerResult.landmarks[0].map((landmark, index) => {
        const poseLandmark: PoseLandmark = {
            index: index,
            x: landmark.x,
            y: landmark.y,
            z: landmark.z,
            visibility: landmark.visibility,
            visible: landmark.visibility >= VISIBILITY_THRESHOLD,
        };
        return poseLandmark;
    }),
    
      /** Overall pose confidence (aggregated) */
      confidence: confidence,
    
      /** Metadata for traceability */
      metadata: {
        source: "mediapipe",
        model: "blazepose",
        timestamp: Date.now(),
        imageSize: {
          width: width,
          height: height,
        },
      },
    }

    return poseData;
}

export default poseAdapter;