"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
    playbackId: string;
    playbackToken?: string | null;
    watermarkText: string;
    watermarkPhone: string;
    title: string;
    onViewStart?: (watchPercentage: number) => void;
}

interface WatermarkPosition {
    x: number;
    y: number;
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
    const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
    const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>({ x: 50, y: 50 });

    // Generate random position for watermark
    const generateRandomPosition = useCallback(() => {
        return {
            x: Math.random() * 60 + 20, // 20% to 80%
            y: Math.random() * 60 + 20, // 20% to 80%
        };
    }, []);

    // Set initial random position
    useEffect(() => {
        setWatermarkPosition(generateRandomPosition());
    }, [generateRandomPosition]);

    // Change watermark position every 10 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setWatermarkPosition(generateRandomPosition());
        }, 10000); // 10 seconds

        return () => clearInterval(intervalId);
    }, [generateRandomPosition]);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
            setIsFullscreen(isFs);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Toggle fullscreen on our container
    const toggleFullscreen = useCallback(async () => {
        const container = containerRef.current;
        if (!container) return;

        try {
            if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
                // Enter fullscreen on our container
                if (container.requestFullscreen) {
                    await container.requestFullscreen();
                } else if ((container as any).webkitRequestFullscreen) {
                    await (container as any).webkitRequestFullscreen();
                }
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if ((document as any).webkitExitFullscreen) {
                    await (document as any).webkitExitFullscreen();
                }
            }
        } catch (err) {
            console.log('Fullscreen error:', err);
        }
    }, []);

    // Intercept Mux Player's fullscreen and use our container instead
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Find the Mux player element
        const muxPlayer = container.querySelector('mux-player');
        if (!muxPlayer) return;

        // Wait for shadow DOM to be ready, then intercept fullscreen button
        const setupFullscreenIntercept = () => {
            const shadowRoot = (muxPlayer as any).shadowRoot;
            if (!shadowRoot) {
                // Retry after a short delay if shadow DOM isn't ready
                setTimeout(setupFullscreenIntercept, 100);
                return;
            }

            // Find the media controller inside shadow DOM
            const mediaController = shadowRoot.querySelector('media-controller');
            if (!mediaController) {
                setTimeout(setupFullscreenIntercept, 100);
                return;
            }

            // Intercept clicks on fullscreen button in shadow DOM
            const handleClick = (e: Event) => {
                const path = e.composedPath();
                const isFullscreenButton = path.some((el: any) => {
                    if (el.tagName) {
                        const tag = el.tagName.toLowerCase();
                        const ariaLabel = el.getAttribute?.('aria-label')?.toLowerCase() || '';
                        return tag === 'media-fullscreen-button' ||
                            tag.includes('fullscreen') ||
                            ariaLabel.includes('fullscreen');
                    }
                    return false;
                });

                if (isFullscreenButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    toggleFullscreen();
                }
            };

            // Add listener with capture phase to intercept before native handling
            muxPlayer.addEventListener('click', handleClick, true);

            // Store cleanup function
            (muxPlayer as any)._fullscreenCleanup = () => {
                muxPlayer.removeEventListener('click', handleClick, true);
            };
        };

        setupFullscreenIntercept();

        // Listen for double-click to toggle fullscreen on our container
        const handleDoubleClick = (e: Event) => {
            e.preventDefault();
            toggleFullscreen();
        };

        muxPlayer.addEventListener('dblclick', handleDoubleClick);

        return () => {
            muxPlayer.removeEventListener('dblclick', handleDoubleClick);
            if ((muxPlayer as any)._fullscreenCleanup) {
                (muxPlayer as any)._fullscreenCleanup();
            }
        };
    }, [toggleFullscreen]);

    // Disable right-click and keyboard shortcuts
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F12") {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
                e.preventDefault();
                return false;
            }
            // Handle 'F' key for fullscreen toggle
            if (e.key === "f" || e.key === "F") {
                if (containerRef.current?.contains(document.activeElement) || isFullscreen) {
                    e.preventDefault();
                    toggleFullscreen();
                }
            }
            // Handle Escape to exit fullscreen
            if (e.key === "Escape" && isFullscreen) {
                toggleFullscreen();
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
    }, [isFullscreen, toggleFullscreen]);

    const handleTimeUpdate = () => {
        if (!playerRef.current || !onViewStart || hasCountedView.current) return;

        const currentTime = playerRef.current.currentTime;
        const duration = playerRef.current.duration;

        if (duration && currentTime && duration > 0) {
            const percentage = (currentTime / duration) * 100;

            if (percentage >= 99 && !hasCountedView.current) {
                hasCountedView.current = true;
                onViewStart(99);
            }
        }
    };

    const handlePlay = () => {
        setHasStartedPlaying(true);
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full bg-black overflow-hidden ${isFullscreen ? '' : 'aspect-video rounded-2xl shadow-2xl'}`}
            onContextMenu={(e) => e.preventDefault()}
            style={{
                isolation: 'isolate',
                ...(isFullscreen && {
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 9999,
                })
            }}
        >
            {/* CSS to hide Mux's native fullscreen and PIP buttons */}
            <style jsx global>{`
                mux-player::part(pip button),
                mux-player [slot="pip-button"],
                mux-player::part(bottom pip button),
                media-pip-button,
                mux-player::part(fullscreen button),
                mux-player [slot="fullscreen-button"],
                mux-player::part(bottom fullscreen button),
                media-fullscreen-button {
                    display: none !important;
                }
            `}</style>

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
                style={{
                    width: '100%',
                    height: '100%',
                    '--media-accent-color': '#64748b',
                } as any}
                autoPlay={false}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
            />

            {/* Custom fullscreen button - only shows after video has been played */}
            {hasStartedPlaying && (
                <button
                    onClick={toggleFullscreen}
                    className="absolute flex items-center mr-18 justify-center transition-opacity hover:opacity-80"
                    title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    style={{
                        right: '10px',
                        bottom: '10px',
                        zIndex: 10000,
                        width: '20px',
                        height: '20px',
                        color: 'white',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    {isFullscreen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                    )}
                </button>
            )}

            {/* Watermark - stays in place for 10 seconds, then moves to a new random position */}
            <div
                className="pointer-events-none select-none transition-all duration-1000 ease-in-out"
                style={{
                    position: 'absolute',
                    left: `${watermarkPosition.x}%`,
                    top: `${watermarkPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    opacity: 0.3,
                    fontSize: isFullscreen ? '18px' : '13px',
                    fontWeight: 600,
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                }}
            >
                <div className="flex flex-col items-center gap-0.5">
                    <span>{watermarkText}</span>
                    <span style={{ opacity: 0.8 }}>{watermarkPhone}</span>
                </div>
            </div>
        </div>
    );
}
