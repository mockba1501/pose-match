'use client';
import { useEffect, useRef } from "react";
import type { PoseData } from "../types/poseData";
import { POSE_CONNECTIONS } from "../lib/pose/poseLandmarks";
import { POSE_VIEWPORT } from "../config/poseViewport";

const PoseCanvas = ({image, poseData}:
    {
        image: HTMLImageElement | null,
        poseData: PoseData|null
    }) => {

    const canvasRef = useRef<HTMLCanvasElement|null>(null);

    const drawLandmarks = (
        ctx: CanvasRenderingContext2D,
        pose: PoseData,
        drawWidth: number,
        drawHeight: number,
        offsetX: number,
        offsetY: number
    ) => {
        ctx.fillStyle = "red";
        for (const landmark of pose.landmarks) {
            if(!landmark.visible)
                continue;

            //const x = landmark.x + ctx.canvas.width * drawWidth;
            //const y = landmark.y + ctx.canvas.height * drawHeight;

            const x = offsetX + landmark.x * drawWidth;
            const y = offsetY + landmark.y * drawHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const drawConnectors = (
        ctx: CanvasRenderingContext2D,
        pose: PoseData,
        connections: Array<[number, number]>,
        drawWidth: number,
        drawHeight: number,
        offsetX: number,
        offsetY: number
    ) => {
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        
        for (const [startIdx, endIdx] of connections) {
            const startLandmark = pose.landmarks[startIdx];
            const endLandmark = pose.landmarks[endIdx];

            if(!startLandmark.visible || !endLandmark.visible)
                continue;

            const startX = offsetX + startLandmark.x * drawWidth;
            const startY = offsetY + startLandmark.y * drawHeight;
            const endX = offsetX + endLandmark.x * drawWidth;
            const endY = offsetY + endLandmark.y * drawHeight;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    useEffect(()=> {
        const canvas = canvasRef.current;
        if(!canvas)
            return;

        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;

         // Set canvas size to match image
        canvas.width = POSE_VIEWPORT.width;
        canvas.height = POSE_VIEWPORT.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(!image)
            return;
        
        const scale = Math.min(
            POSE_VIEWPORT.width/ image.width,
            POSE_VIEWPORT.height/ image.height
        )

        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;

        const offsetX = (POSE_VIEWPORT.width - drawWidth) / 2;
        const offsetY = (POSE_VIEWPORT.height - drawHeight) / 2;
        
        // the original image
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

        if(!poseData)
            return;
        // draw pose landmarks and connections
        drawConnectors(ctx, poseData, POSE_CONNECTIONS, drawWidth, drawHeight, offsetX, offsetY);
        drawLandmarks(ctx, poseData, drawWidth, drawHeight, offsetX, offsetY);

    },[image, poseData]);

    return (
        <div className="flex items-center justify-center">
        <canvas ref={canvasRef} 
            width={POSE_VIEWPORT.width}
            height={POSE_VIEWPORT.height}
            className="bg-white rounded-md"></canvas>
        </div>
    )
}

export default PoseCanvas;