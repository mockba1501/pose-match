import { useEffect, useState, useCallback } from "react";

const useWebcam = () => {
    const [status, setStatus] = useState<"idle" | "requesting" | "ready" | "error">("idle");
    const [stream, setStream] = useState<MediaStream | null>(null);

    const reset = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setStream(null);
        setStatus("idle");
    }, [stream]);

    const startStream = useCallback(async () => {
        if (status === "error") {
            reset(); // optionally reset before requesting again
        }

        setStatus("requesting");

        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });

            setStatus("ready");
            setStream(cameraStream);

            //cleaning up the stream
            return true;
        } catch (error: unknown) {
            setStatus("error");
            console.log(error);
            return false
        }
    }, [status, reset]);

    const stopStream = useCallback(() => {
        if (!stream)
            return;
        stream.getTracks().forEach(track => track.stop());
        setStatus("idle");
        setStream(null);
    }, [stream]);

    useEffect(() => {
        // This effect runs once on mount
        return () => {
            // Cleanup on unmount
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return { status, stream, startStream, stopStream };
}

export default useWebcam;