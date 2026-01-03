import type { PoseData, LandmarkState } from "../types/poseData";
import { useRef, useEffect } from "react";
import { POSE_CONNECTIONS, statePriority } from "../lib/pose/poseLandmarks";
import { POSE_VIEWPORT } from "../config/poseViewport";

function checkState(pointA: LandmarkState, pointB: LandmarkState) :  LandmarkState {
    return statePriority[pointB] >= statePriority[pointA]? pointB : pointA;
}

const UserPoseCanvas = ({ video, poseData, landMarkStates }:
    {
        video: HTMLVideoElement | null,
        poseData: PoseData | null,
        landMarkStates: Record<number, LandmarkState>
    }
) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestRef = useRef<number>(0);
    const lastSizeRef = useRef({ width: 0, height: 0 });

    const drawLandmarks = (
        ctx: CanvasRenderingContext2D,
        pose: PoseData,
    ) => {
        ctx.fillStyle = "DarkSlateGray";
        for (const landmark of pose.landmarks) {
            if (!landmark.visible)
                continue;

            const color = landMarkStates[landmark.index];
            ctx.fillStyle = color;
            const x = landmark.x * ctx.canvas.width;
            const y = landmark.y * ctx.canvas.height;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const drawConnectors = (
        ctx: CanvasRenderingContext2D,
        pose: PoseData,
        connections: Array<[number, number]>,
        landMarkStates: Record<number, LandmarkState>
    ) => {
        ctx.strokeStyle = "Gray";
        ctx.lineWidth = 2;

        for (const [startIdx, endIdx] of connections) {
            const startLandmark = pose.landmarks[startIdx];
            const endLandmark = pose.landmarks[endIdx];

            if (!startLandmark.visible || !endLandmark.visible)
                continue;

            const startX = startLandmark.x * ctx.canvas.width;
            const startY = startLandmark.y * ctx.canvas.height;
            const endX = endLandmark.x * ctx.canvas.width;
            const endY = endLandmark.y * ctx.canvas.height;

            const color = checkState(landMarkStates[startIdx], landMarkStates[endIdx]);
            ctx.strokeStyle = color;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    const render = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (canvas && ctx && video) {
            if (video.videoWidth !== lastSizeRef.current.width ||
                video.videoHeight !== lastSizeRef.current.height
            ) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                lastSizeRef.current = {
                    width: video.videoWidth,
                    height: video.videoHeight,
                };
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (poseData) {
                // draw pose landmarks and connections
                drawConnectors(ctx, poseData, POSE_CONNECTIONS, landMarkStates);
                drawLandmarks(ctx, poseData);
            }

            requestRef.current = requestAnimationFrame(render);
        }

    }

    useEffect(() => {
        if (!video && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                ctx.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
            }

            lastSizeRef.current = { width: 0, height: 0 };
            cancelAnimationFrame(requestRef.current);
        }
    }, [video]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(requestRef.current);
        }
    }, [video, poseData]);

    return (
        <div>
            <canvas ref={canvasRef}
                className="bg-white rounded-md"
                style={{
                    width: POSE_VIEWPORT.width,
                    height: POSE_VIEWPORT.height,
                }}>
            </canvas>
        </div>
    );
};

export default UserPoseCanvas;
