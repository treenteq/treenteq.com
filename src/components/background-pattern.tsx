export default function BackgroundPattern() {
    return (
        <div className="animated-background">
            <div className="absolute inset-0 z-0">
                <div className="left-bg bg-animate" />
                <div className="right-bg bg-animate" />
            </div>
            {/* Add SVG overlay with animation */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
            >
                <g className="animate-pulse">
                    <path
                        d="M0 0L1440 900M1440 0L0 900"
                        stroke="#00A340"
                        strokeWidth="2"
                        strokeDasharray="10,10"
                        className="animate-dash"
                    />
                    {/* Add more animated paths here */}
                </g>
            </svg>
        </div>
    );
}
