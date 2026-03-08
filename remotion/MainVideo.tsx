import { AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig, Img, interpolate } from "remotion";
import React from "react";
import { MainVideoProps } from "./Root";

export const MainVideo: React.FC<MainVideoProps> = ({ audioUrl, captions, imageUrls, bgAudioUrl, captionStyle = "fade" }) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    if (!audioUrl && imageUrls.length === 0) {
        return <AbsoluteFill style={{ backgroundColor: "black" }} />;
    }

    // Determine how long each image should stay on screen
    // If we have images, divide equally. Default to full duration if only 1 image.
    const framesPerImage = imageUrls.length > 0 ? Math.max(1, Math.floor(durationInFrames / imageUrls.length)) : durationInFrames;

    // Get current word
    const currentTime = frame / fps;
    const currentWord = captions?.find(c => currentTime >= c.start && currentTime <= c.end);

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            {audioUrl && <Audio src={audioUrl} />}
            {bgAudioUrl && <Audio src={bgAudioUrl} volume={0.15} />}

            {imageUrls && imageUrls.map((imgUrl, index) => {
                const startFrame = index * framesPerImage;
                // Last image takes whatever remains to ensure no black frames
                const endFrame = index === imageUrls.length - 1 ? durationInFrames : startFrame + framesPerImage;
                const duration = endFrame - startFrame;

                return (
                    <Sequence key={index} from={startFrame} durationInFrames={Math.max(1, duration)}>
                        <ImageScene imgUrl={imgUrl} durationInFrames={Math.max(1, duration)} index={index} />
                    </Sequence>
                );
            })}

            {/* Captions Overlay */}
            {currentWord && (
                <Sequence from={Math.floor(currentWord.start * fps)} durationInFrames={Math.max(1, Math.floor((currentWord.end - currentWord.start) * fps))}>
                    <AnimatedCaption word={currentWord.punctuated_word} style={captionStyle} />
                </Sequence>
            )}
        </AbsoluteFill>
    );
};

const AnimatedCaption: React.FC<{ word: string, style: string }> = ({ word, style }) => {
    const frame = useCurrentFrame();
    
    // Default base styles for all captions
    let captionStyles: React.CSSProperties = {
        fontSize: "90px",
        fontWeight: "900",
        color: "white",
        textShadow: "0px 6px 20px rgba(0,0,0,0.8), 0px 2px 5px rgba(0,0,0,0.5)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        padding: "10px 40px",
        textTransform: "uppercase",
    };

    if (style === "fade") {
        const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
        captionStyles = { ...captionStyles, opacity };
    } else if (style === "pop") {
        const scale = interpolate(frame, [0, 5], [0.5, 1], { extrapolateRight: "clamp" });
        captionStyles = { ...captionStyles, transform: `scale(${scale})` };
    } else if (style === "scale") {
        const scale = interpolate(frame, [0, 30], [1, 1.15], { extrapolateRight: "clamp" });
        captionStyles = { ...captionStyles, transform: `scale(${scale})` };
    } else if (style === "slide") {
        const translateY = interpolate(frame, [0, 5], [50, 0], { extrapolateRight: "clamp" });
        const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
        captionStyles = { ...captionStyles, transform: `translateY(${translateY}px)`, opacity };
    } else if (style === "typewriter") {
        const lettersToShow = Math.floor(interpolate(frame, [0, 10], [0, word.length], { extrapolateRight: "clamp" }));
        word = word.substring(0, lettersToShow);
    } else if (style === "karaoke") {
        // Highlight color
        captionStyles = { ...captionStyles, color: "#fbbf24" };
    }

    return (
        <AbsoluteFill style={{ 
            justifyContent: "center", 
            alignItems: "center",
            top: "20%" 
        }}>
            <div style={captionStyles}>
                {word}
            </div>
        </AbsoluteFill>
    );
};

// Animate each image locally based on its relative frame
const ImageScene: React.FC<{ imgUrl: string, durationInFrames: number, index: number }> = ({ imgUrl, durationInFrames, index }) => {
    const frame = useCurrentFrame();
    
    // Rotate animations: 0 = zoom in slowly, 1 = zoom out slowly, 2 = slide up
    const animType = index % 3;
    
    let scale = 1.1; // Default slight scale to avoid edges
    let translateY = 0;
    
    if (animType === 0) {
        // Zoom in
        scale = interpolate(frame, [0, durationInFrames], [1.05, 1.2]);
    } else if (animType === 1) {
        // Zoom out
        scale = interpolate(frame, [0, durationInFrames], [1.2, 1.05]);
    } else if (animType === 2) {
        // Slide up slightly
        scale = 1.15;
        translateY = interpolate(frame, [0, durationInFrames], [20, -20]);
    }
                       
    // Fade in effect for the first 15 frames
    const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
            <Img 
                src={imgUrl} 
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // ensure vertical images cover
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                    opacity: opacity
                }}
            />
        </AbsoluteFill>
    );
};
