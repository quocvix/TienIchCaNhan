import { useState, useEffect } from "react";

export interface VisualViewportState {
    height: number;
    width: number;
    bottomOffset: number;
    offsetTop: number;
}

export function useVisualViewport(): VisualViewportState {
    const [viewport, setViewport] = useState<VisualViewportState>(() => {
        if (typeof window !== "undefined" && window.visualViewport) {
            const vv = window.visualViewport;
            const bottomOffset = Math.max(
                0,
                window.innerHeight - (vv.height + vv.offsetTop)
            );
            return {
                height: vv.height,
                width: vv.width,
                bottomOffset,
                offsetTop: vv.offsetTop,
            };
        }
        return {
            height: typeof window !== "undefined" ? window.innerHeight : 0,
            width: typeof window !== "undefined" ? window.innerWidth : 0,
            bottomOffset: 0,
            offsetTop: 0,
        };
    });

    useEffect(() => {
        if (typeof window === "undefined" || !window.visualViewport) return;

        const handleViewportChange = () => {
            const vv = window.visualViewport;
            if (!vv) return;

            const bottomOffset = Math.max(
                0,
                window.innerHeight - (vv.height + vv.offsetTop)
            );

            const newState = {
                height: vv.height,
                width: vv.width,
                bottomOffset,
                offsetTop: vv.offsetTop,
            };

            setViewport(newState);

            // Update global CSS custom properties
            document.documentElement.style.setProperty(
                "--vv-height",
                `${vv.height}px`
            );
            document.documentElement.style.setProperty(
                "--vv-bottom-offset",
                `${bottomOffset}px`
            );
        };

        handleViewportChange();

        const vv = window.visualViewport;
        vv.addEventListener("resize", handleViewportChange);
        vv.addEventListener("scroll", handleViewportChange);

        return () => {
            vv.removeEventListener("resize", handleViewportChange);
            vv.removeEventListener("scroll", handleViewportChange);
        };
    }, []);

    return viewport;
}
