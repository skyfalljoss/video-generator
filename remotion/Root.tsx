import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

export type CaptionWord = {
    word: string;
    start: number;
    end: number;
    punctuated_word: string;
};

export type MainVideoProps = {
    audioUrl: string;
    captions: CaptionWord[];
    imageUrls: string[];
    bgAudioUrl?: string;
    captionStyle?: string;
    durationInFrames?: number; // optionally forced
};

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="MainVideo"
                component={MainVideo}
                durationInFrames={300} // Default value
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    audioUrl: "",
                    captions: [],
                    imageUrls: [],
                    bgAudioUrl: undefined,
                    captionStyle: "fade"
                } as MainVideoProps}
                calculateMetadata={async ({ props }) => {
                    let durationInFrames = props.durationInFrames;
                    if (!durationInFrames && props.captions && props.captions.length > 0) {
                        const lastCaption = props.captions[props.captions.length - 1];
                        durationInFrames = Math.ceil((lastCaption.end + 0.5) * 30); // Add 0.5s padding
                    } else if (!durationInFrames) {
                        // Fallback
                        durationInFrames = 300; // 10 seconds
                    }
                    
                    return {
                        durationInFrames,
                        props
                    };
                }}
            />
        </>
    );
};
