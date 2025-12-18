"use client";
import { useState } from 'react';
import useMediaPipePoseDetector from '../hooks/useMediaPipePoseDetector'
//import type { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import poseAdapter from '../lib/pose/poseAdapter';
import type { PoseData } from "../types/poseData";
import Spinner from '../ui/Spinner';

export default function PoseDetector({image, onPoseData}:
    {
        image: HTMLImageElement | null,
        onPoseData: (results:PoseData|null)=>void
    }) {
    const [isDetecting, setIsDetecting] = useState<boolean>(false);
    const {detect, isReady, isLoading, error} = useMediaPipePoseDetector();

    const handleDetection = async () => {
        if(!isReady || !image)
            return;

        setIsDetecting(true);
        const minDelay = new Promise(res => setTimeout(res, 300)); //To show the spinner in the button
        try {
            const poseResults = await detect(image);
            
            if(poseResults)
            {
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

    return (
        <div className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Pose Detector</h4>

      {/* Status */}
      <div className="mb-4">
        {isLoading && <p className="text-blue-500">Loading model...</p>}
        {!isLoading && isReady && <p className="text-green-500">Model ready!</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!image && <p className="text-gray-500">Select an image to detect pose.</p>}
      </div>

      {/* Detect Button */}
      <button
        onClick={handleDetection}
        disabled={!isReady || !image || isLoading || isDetecting}
        className={`px-4 py-2 rounded shadow-sm font-medium text-white
          ${(!isReady || !image || isLoading || isDetecting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
      >
        {isDetecting ? "Detecting..." : "Detect Pose"}
        {isDetecting && <Spinner/>}
      </button>

      
    </div>
    );
}
