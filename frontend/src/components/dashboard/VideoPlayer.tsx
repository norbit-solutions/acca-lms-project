"use client";

import { useRef, useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
    playbackId: string;
    playbackToken?: string | null;
    watermarkText: string;
    watermarkPhone: string;
    title: string;
    onViewStart?: (watchPercentage: number) => void;
}

export default function VideoPlayer({
    playbackId,
    playbackToken,
    watermarkText,
    watermarkPhone,
    title,
    onViewStart,
}: VideoPlayerProps) {
    const hasCountedView = useRef(false);
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Handle fullscreen changes to keep watermark visible
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Disable right-click and keyboard shortcuts for dev tools
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block F12
            if (e.key === "F12") {
                e.preventDefault();
                return false;
            }
            // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Dev Tools)
            if (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) {
                e.preventDefault();
                return false;
            }
            // Block Ctrl+U (View Source)
            if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
                e.preventDefault();
                return false;
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("contextmenu", handleContextMenu);
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            if (container) {
                container.removeEventListener("contextmenu", handleContextMenu);
            }
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleTimeUpdate = () => {
        if (!playerRef.current || !onViewStart || hasCountedView.current) return;

        const currentTime = playerRef.current.currentTime;
        const duration = playerRef.current.duration;

        if (duration && currentTime && duration > 0) {
            const percentage = (currentTime / duration) * 100;

            // Count view when 99% watched
            if (percentage >= 99 && !hasCountedView.current) {
                hasCountedView.current = true;
                onViewStart(99);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onContextMenu={(e) => e.preventDefault()}
        >
            <MuxPlayer
                ref={playerRef}
                playbackId={playbackId}
                tokens={{
                    playback: playbackToken || undefined,
                }}
                metadata={{
                    video_title: title,
                }}
                streamType="on-demand"
                className="w-full h-full"
                autoPlay={false}
                onTimeUpdate={handleTimeUpdate}
            />


            {/* Center watermark (anti-recording) */}
            <div
                className="absolute pointer-events-none select-none text-white/30 text-sm font-medium animate-pulse"
                style={{
                    zIndex: 2147483646,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    position: isFullscreen ? 'fixed' : 'absolute',
                }}
            >
                {watermarkPhone}
            </div>
        </div>
    );
}
