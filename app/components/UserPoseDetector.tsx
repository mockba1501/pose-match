"use client";
import { useRef, useEffect } from 'react';
import useMediaPipePoseDetector from '../hooks/useMediaPipePoseDetector'
import poseAdapter from '../lib/pose/poseAdapter';
import type { PoseData } from "../types/poseData";

export default function UserPoseDetector({ video, onPoseData }:
    {
        video: HTMLVideoElement | null,
        onPoseData: (results: PoseData | null) => void
    }) {
    const { detectVideo, isReady, isLoading, error } = useMediaPipePoseDetector("VIDEO");
    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(0);
    const DETECTION_INTERVAL = 100; // ms

    const isActiveRef = useRef<boolean>(false);
    const inProgressRef = useRef<boolean>(false);

    const handleDetection = async (time: number) => {
        if (!isReady || !video || inProgressRef.current || !isActiveRef.current) {
            requestRef.current = requestAnimationFrame(handleDetection);
            return;
        }

        const deltaTime = time - previousTimeRef.current;

        if (deltaTime < DETECTION_INTERVAL) {
            requestRef.current = requestAnimationFrame(handleDetection);
            return;
        }

        previousTimeRef.current = time;

        try {
            inProgressRef.current = true;
            const poseResults = await detectVideo(video);

            if (poseResults) {
                console.log("Pose results:", poseResults);
                const poseData = poseAdapter(poseResults, video.videoWidth, video.videoHeight);
                onPoseData(poseData);
            }
        } catch (error) {
            console.error("Error during pose detection:", error);
        } finally {
            inProgressRef.current = false;
            console.log("Detection completed.");
            if (video)
                requestRef.current = requestAnimationFrame(handleDetection);
        }
    }

    useEffect(() => {
        if (!video)
            return;

        isActiveRef.current = true;
        requestRef.current = requestAnimationFrame(handleDetection);

        return () => {
            cancelAnimationFrame(requestRef.current);
            isActiveRef.current = false;
        }
    }, [isReady, video])

    return (
        <div className="flex flex-col items-center gap-2">
            {isLoading && <p className="text-blue-500">Loading model...</p>}
            {!isLoading && isReady && <p className="text-green-500">Model ready!</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
        </div>
    );
}
