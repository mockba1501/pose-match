import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { useEffect, useState, useRef, useCallback } from "react";

const useMediaPipePoseDetector = () => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    //Actually the type should be of WasmFileset but it's not exported from the library 
    //const visionTaskRef = useRef<unknown|null>(null); 
    const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadModel = async () => {
            setIsLoading(true);
            setIsReady(false);
            setError(null);

            try {
                console.log("Loading MediaPipe Vision Task ...");
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                console.log("MediaPipe vision task loaded.");

                if (cancelled) return;
                poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(
                    vision,
                    {
                        baseOptions: {
                            modelAssetPath: "/models/pose_landmarker_full.task",
                            delegate: "GPU",
                        },
                        runningMode: "IMAGE"
                    });
                if (!cancelled)
                    setIsReady(true);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                setError("Error loading MediaPipe Pose Landmarker model:" + message)
                console.error("Error loading MediaPipe Pose Landmarker model:", error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadModel();

        //cleanup function
        return () => {
            cancelled = true;
            console.log("Cleaning up MediaPipe Pose Landmarker...");
            poseLandmarkerRef.current?.close();
            poseLandmarkerRef.current = null;
        }

    }, []);

    const detect = useCallback(async (imageElement: HTMLImageElement) => {
        if (!poseLandmarkerRef.current) {
            //throw new Error('Model is not loaded yet');
            return null;
        }
        console.log("Detecting poses from the image...");
        return await poseLandmarkerRef.current.detect(imageElement);
    }, []);

    const detectVideo = useCallback(async (videoElement: HTMLVideoElement) => {
        if (!poseLandmarkerRef.current) {
            //throw new Error('Model is not loaded yet');
            return null;
        }
        const timestamp = performance.now();
        console.log("Detecting poses from video stream ...");
        return await poseLandmarkerRef.current.detectForVideo(videoElement, timestamp);
    }, []);
    return { isReady, isLoading, error, detect, detectVideo }
}

export default useMediaPipePoseDetector;