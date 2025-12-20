"use client";
import { useState } from 'react';
import useMediaPipePoseDetector from '../hooks/useMediaPipePoseDetector'
//import type { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import poseAdapter from '../lib/pose/poseAdapter';
import type { PoseData } from "../types/poseData";
import Spinner from '../ui/Spinner';
import { BUTTON_BASE, BUTTON_PRIMARY, BUTTON_DISABLED } from "../config/ui";


export default function PoseDetector({ image, onPoseData }:
  {
    image: HTMLImageElement | null,
    onPoseData: (results: PoseData | null) => void
  }) {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const { detect, isReady, isLoading, error } = useMediaPipePoseDetector();

  const handleDetection = async () => {
    if (!isReady || !image)
      return;

    setIsDetecting(true);
    const minDelay = new Promise(res => setTimeout(res, 300)); //To show the spinner in the button
    try {
      const poseResults = await detect(image);

      if (poseResults) {
        console.log("Pose results:", poseResults);
        const poseData = poseAdapter(poseResults, image.width, image.height);
        onPoseData(poseData);
      }
      await minDelay;
    } finally {
      console.log("Detection completed.");
      setIsDetecting(false);
    }
  }
  const isDisabled = !isReady || !image || isLoading || isDetecting;

  return (
    <div className="flex flex-col items-center gap-2">
      {isLoading && <p className="text-blue-500">Loading model...</p>}
      {!isLoading && isReady && <p className="text-green-500">Model ready!</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!image && <p className="text-gray-500">Select an image to detect pose.</p>}

      {/* Detect Button */}
      <button
        onClick={handleDetection}
        disabled={!isReady || !image || isLoading || isDetecting}
        className={[BUTTON_BASE, isDisabled ? BUTTON_DISABLED : BUTTON_PRIMARY].join(" ")}
      >
        {isDetecting ? "Detecting..." : "Detect Pose"}
        {isDetecting && <Spinner />}
      </button>
    </div>
  );
}
