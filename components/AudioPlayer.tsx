'use client';
function AudioPlayer({ src }: { src: string }) {
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls>
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default AudioPlayer;
