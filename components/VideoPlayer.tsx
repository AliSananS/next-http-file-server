import React from 'react';

interface VideoPlayerProps {
	src: string;
	alt?: string;
	className?: string;
	style?: React.CSSProperties;
	controls?: boolean;
	autoPlay?: boolean;
	loop?: boolean;
	poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
	src,
	alt,
	className,
	style,
	controls = true,
	autoPlay = false,
	loop = false,
	poster,
}) => {
	return (
		<div className={className} style={style}>
			<video
				autoPlay={autoPlay}
				controls={controls}
				loop={loop}
				poster={poster}
				src={src}
				style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }}
				title={alt}
			>
				<track kind="captions" label="English captions" src="" />
				Sorry, your browser does not support embedded videos.
			</video>
		</div>
	);
};

export default VideoPlayer;
