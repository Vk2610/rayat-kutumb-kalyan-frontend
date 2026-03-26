import { useState, useRef, useEffect } from "react";

export default function ZoomableImage({ src }) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const MIN_ZOOM = 1;
    const MAX_ZOOM = 7;

    const centerImage = () => {
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };

    const handleWheel = (e) => {
        e.preventDefault();
        let newScale = scale + (e.deltaY < 0 ? 0.15 : -0.15);
        newScale = Math.min(Math.max(newScale, MIN_ZOOM), MAX_ZOOM);
        setScale(newScale);
    };

    const handleMouseDown = (e) => {
        if (scale === 1) return;
        setDragging(true);
        setOrigin({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        setPosition({
            x: e.clientX - origin.x,
            y: e.clientY - origin.y,
        });
    };

    const handleMouseUp = () => setDragging(false);

    const handleDoubleClick = () => {
        if (scale === 1) {
            setScale(2);
        } else {
            centerImage();
        }
    };

    const toggleFullscreen = () => {
        const el = containerRef.current;
        if (!document.fullscreenElement) el.requestFullscreen();
        else document.exitFullscreen();
    };

    const zoomIn = () => setScale((s) => Math.min(s + 0.3, MAX_ZOOM));
    const zoomOut = () => setScale((s) => Math.max(s - 0.3, MIN_ZOOM));
    const rotateLeft = () => setRotation((r) => r - 90);
    const rotateRight = () => setRotation((r) => r + 90);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "+") zoomIn();
            if (e.key === "-") zoomOut();
            if (e.key === "r") rotateRight();
            if (e.key === "f") toggleFullscreen();
            if (e.key === "Escape") centerImage();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const greenBtn = {
        background: "#27ae60",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "0.2s",
    };

    const greenBtnHover = {
        background: "#1e874b",
    };

    return (
        <div style={{ position: "relative" }}>
            {/* -------- GREEN BUTTON GROUP -------- */}
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    gap: "10px",
                    zIndex: 20,
                }}
            >
                <button
                    style={greenBtn}
                    onMouseOver={(e) => Object.assign(e.target.style, greenBtnHover)}
                    onMouseOut={(e) => Object.assign(e.target.style, greenBtn)}
                    onClick={zoomIn}
                >
                    ➕
                </button>

                <button
                    style={greenBtn}
                    onMouseOver={(e) => Object.assign(e.target.style, greenBtnHover)}
                    onMouseOut={(e) => Object.assign(e.target.style, greenBtn)}
                    onClick={zoomOut}
                >
                    ➖
                </button>

                <button
                    style={greenBtn}
                    onMouseOver={(e) => Object.assign(e.target.style, greenBtnHover)}
                    onMouseOut={(e) => Object.assign(e.target.style, greenBtn)}
                    onClick={rotateLeft}
                >
                    ⟲
                </button>

                <button
                    style={greenBtn}
                    onMouseOver={(e) => Object.assign(e.target.style, greenBtnHover)}
                    onMouseOut={(e) => Object.assign(e.target.style, greenBtn)}
                    onClick={rotateRight}
                >
                    ⟳
                </button>

                <button
                    style={greenBtn}
                    onMouseOver={(e) => Object.assign(e.target.style, greenBtnHover)}
                    onMouseOut={(e) => Object.assign(e.target.style, greenBtn)}
                    onClick={centerImage}
                >
                    🔄 Reset
                </button>

                <button
                    style={greenBtn}
                    onMouseOver={(e) => Object.assign(e.target.style, greenBtnHover)}
                    onMouseOut={(e) => Object.assign(e.target.style, greenBtn)}
                    onClick={toggleFullscreen}
                >
                    ⛶ Full
                </button>
            </div>

            {/* -------- IMAGE VIEWER -------- */}
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "600px",
                    overflow: "hidden",
                    background: "#000",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: dragging ? "grabbing" : "grab",
                }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
            >
                <img
                    src={src}
                    alt="preview"
                    draggable={false}
                    style={{
                        transform: `
                            translate(${position.x}px, ${position.y}px)
                            scale(${scale})
                            rotate(${rotation}deg)
                        `,
                        transition: dragging ? "none" : "transform 0.2s ease",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />
            </div>
        </div>
    );
}
