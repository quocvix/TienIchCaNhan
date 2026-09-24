import React from "react";

interface MobileAppShellProps {
    children: React.ReactNode;
}

export default function MobileAppShell({ children }: MobileAppShellProps) {
    return (
        <div className="min-h-screen w-full bg-[#05070B] text-white flex flex-col items-center justify-center sm:py-4 select-none relative overflow-x-hidden font-sans">
            {/* Desktop Ambient Glow */}
            <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Mobile Device Container */}
            <main
                id="mobile-app-root"
                role="main"
                className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[880px] sm:max-h-[94vh] bg-[#07090E] flex flex-col relative overflow-hidden sm:rounded-[44px] sm:border-[6px] sm:border-[#1E2330] sm:shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]"
            >
                {/* Content Viewport */}
                <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden safe-top">
                    {children}
                </div>

                {/* Mobile Bottom Home Bar Indicator (Desktop preview) */}
                <footer
                    aria-label="Mobile Home Indicator"
                    className="hidden sm:flex w-full h-5 shrink-0 items-center justify-center bg-[#07090E] pb-1 safe-bottom"
                >
                    <div className="w-32 h-1 bg-white/20 rounded-full" />
                </footer>
            </main>

            {/* Desktop Helper Tag */}
            <aside
                aria-label="Device Preview Badge"
                className="hidden sm:flex items-center gap-2 mt-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase"
            >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Chế độ giả lập Mobile App (390 x 844)
            </aside>
        </div>
    );
}
