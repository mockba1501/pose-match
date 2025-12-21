"use client";
import useWebcam from "../hooks/useWebcam";
import { POSE_VIEWPORT } from '../config/poseViewport';
import { BUTTON_BASE, BUTTON_PRIMARY, BUTTON_DANGER } from "../config/ui";

import { useRef, useEffect, useCallback } from "react";

const UserPoseInput = ({ onVideoReady, onStatusChanged, onStartReady, onStopReady }:
    {
        onVideoReady: (video: HTMLVideoElement | null) => void,
        onStatusChanged: (status: "idle" | "requesting" | "ready" | "error") => void,
        onStartReady: (start: () => void) => void,
        onStopReady: (stop: () => void) => void
    }
) => {

    const webcamRef = useRef<HTMLVideoElement | null>(null)
    const { status, stream, startStream, stopStream } = useWebcam();

    useEffect(() => {
        if (!stream && webcamRef.current) {
            webcamRef.current.srcObject = null;
        }

        if (!stream || !webcamRef.current)
            return;

        webcamRef.current.srcObject = stream;
        webcamRef.current.play().catch(console.error);

        // We don't want to re-trigger this on every stream change, but we need to ensure the parent has the latest functions
        // However, startStream and handleStopStream are now stable or properly updated.

        webcamRef.current.onloadedmetadata = null;
        webcamRef.current.onloadedmetadata = () => {
            onVideoReady(webcamRef.current!);
        };

    }, [stream, onVideoReady]);

    const handleStopStream = useCallback(() => {
        stopStream();
        if (webcamRef.current) {
            webcamRef.current.srcObject = null;
        }
        onVideoReady(null);
    }, [stopStream, onVideoReady]);

    useEffect(() => {
        // Wrap in arrow function to prevent React from executing immediately if onStartReady sets a state
        onStartReady(() => startStream);
        onStopReady(() => handleStopStream);
    }, [startStream, handleStopStream, onStartReady, onStopReady]);

    useEffect(() => {
        onStatusChanged(status);
    }, [status, onStatusChanged]);

    return (
        <div className="flex flex-col items-center gap-2">
            <video ref={webcamRef} autoPlay muted playsInline width={POSE_VIEWPORT.width} height={POSE_VIEWPORT.height} hidden />
        </div>
    );
};

UserPoseInput.displayName = "UserPoseInput";

export default UserPoseInput;
