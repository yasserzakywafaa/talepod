import ReactAudioPlayer from "react-audio-player";

export interface AudioPlayerProps {
  audioUrl: string;
}

export const AudioPlayer = (params: AudioPlayerProps): JSX.Element => {
  return (
    <>
      <ReactAudioPlayer
        src={params.audioUrl}
        autoPlay={false}
        controls
        title="AUDIO_FILE"
      />
    </>
  );
};
