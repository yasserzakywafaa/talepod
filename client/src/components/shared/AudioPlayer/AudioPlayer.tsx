export interface AudioPlayerProps {
  url: string;
  name: string;
}

export const AudioPlayer = (params: AudioPlayerProps): JSX.Element => {
  return (
    <>
      <audio
        controls
        src={params.url}
        autoPlay={false}
        title={params.name}
        style={{ width: "100%" }}
      />
    </>
  );
};
