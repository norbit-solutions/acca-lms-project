"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import MuxPlayer, { MuxPlayerRefAttributes } from "@mux/mux-player-react";

interface VideoPlayerProps {
    playbackId: string;
    playbackToken?: string | null;
    watermarkPhone: string;
    title: string;
    onViewStart?: (watchPercentage: number) => void;
    onReady?: () => void;
}

interface WatermarkPosition {
    x: number;
    y: number;
}

export default function VideoPlayer({
    playbackId,
    playbackToken,
    watermarkPhone,
    title,
    onViewStart,
    onReady,
}: VideoPlayerProps) {
    const hasCountedView = useRef(false);
    const playerRef = useRef<MuxPlayerRefAttributes>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
    const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>({ x: 50, y: 50 });
    const [isScreenRecording, setIsScreenRecording] = useState(false);

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

    // Screen recording detection
    useEffect(() => {
        // Method 1: Detect when Display Capture API is used
        const detectDisplayCapture = () => {
            if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
                const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
                navigator.mediaDevices.getDisplayMedia = async function(...args) {
                    setIsScreenRecording(true);
                    return originalGetDisplayMedia.apply(this, args);
                };
            }
        };

        // Method 2: Visibility change detection (might indicate recording setup)
        const handleVisibilityChange = () => {
            // Some screen recorders cause visibility changes
            if (document.hidden) {
                // Could be recording, but don't block - just be aware
            }
        };

        // Method 3: Detect Picture-in-Picture (often used with recording)
        const handlePipChange = () => {
            if (document.pictureInPictureElement) {
                setIsScreenRecording(true);
            }
        };

        // Method 4: Monitor for DevTools and screen recording indicators
        const detectDevTools = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                // DevTools might be open - potential recording
            }
        };

        detectDisplayCapture();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('enterpictureinpicture', handlePipChange);
        window.addEventListener('resize', detectDevTools);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('enterpictureinpicture', handlePipChange);
            window.removeEventListener('resize', detectDevTools);
        };
    }, []);

    // Additional protection: Blur video when page is not visible or potential recording detected
    useEffect(() => {
        const handleBlur = () => {
            // When window loses focus, could indicate screen capture
        };

        const handleFocus = () => {
            setIsScreenRecording(false);
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFs = !!(document.fullscreenElement || (document as unknown as { webkitFullscreenElement: Element }).webkitFullscreenElement);
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
            if (!document.fullscreenElement && !(document as unknown as { webkitFullscreenElement: Element }).webkitFullscreenElement) {
                // Enter fullscreen on our container
                if (container.requestFullscreen) {
                    await container.requestFullscreen();
                } else if ((container as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen) {
                    await (container as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
                }
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if ((document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen) {
                    await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
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
            const shadowRoot = (muxPlayer as unknown as { shadowRoot: ShadowRoot }).shadowRoot;
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
                const isFullscreenButton = path.some((el) => {
                    if (el instanceof Element) {
                        const tag = el.tagName.toLowerCase();
                        const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
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
            (muxPlayer as unknown as { _fullscreenCleanup: () => void })._fullscreenCleanup = () => {
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
            if ((muxPlayer as unknown as { _fullscreenCleanup: () => void })._fullscreenCleanup) {
                (muxPlayer as unknown as { _fullscreenCleanup: () => void })._fullscreenCleanup();
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
            // Detect PrintScreen key
            if (e.key === "PrintScreen") {
                e.preventDefault();
                setIsScreenRecording(true);
                setTimeout(() => setIsScreenRecording(false), 3000);
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
            {/* CSS to hide Mux's native fullscreen and PIP buttons + screen recording protection */}
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
                
                /* Attempt to prevent screen capture visibility */
                @media (display-mode: picture-in-picture) {
                    .video-protected {
                        filter: blur(50px) brightness(0.1) !important;
                    }
                }
            `}</style>

            {/* Screen Recording Overlay - Blacks out video when recording detected */}
            {isScreenRecording && (
                <div
                    className="absolute inset-0 z-[10001] bg-black flex items-center justify-center"
                    style={{ pointerEvents: 'none' }}
                >
                    <div className="text-center text-white">
                        <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <p className="text-lg font-semibold">Screen Recording Detected</p>
                        <p className="text-sm text-gray-400 mt-2">Video playback is protected</p>
                    </div>
                </div>
            )}

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
                className={`w-full h-full video-protected ${isScreenRecording ? 'blur-3xl brightness-0' : ''}`}
                style={{
                    width: '100%',
                    height: '100%',
                    '--media-accent-color': '#64748b',
                } }
                autoPlay={false}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onCanPlay={onReady}
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

            {/* Watermark - only shows phone number, moves every 10 seconds */}
            <div
                className="pointer-events-none select-none"
                style={{
                    position: 'absolute',
                    left: `${watermarkPosition.x}%`,
                    top: `${watermarkPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    opacity: 0.4,
                    fontSize: isFullscreen ? '20px' : '14px',
                    fontWeight: 600,
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    letterSpacing: '0.05em',
                }}
            >
                {watermarkPhone}
            </div>
        </div>
    );
}

