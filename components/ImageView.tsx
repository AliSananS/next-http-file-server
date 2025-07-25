'use client';

import { useState } from 'react';
import { Image } from '@heroui/image';
import { Button } from '@heroui/button';

import { FullScreenIcon } from '@/components/icons';

type ImageViewProps = {
  src: string;
  alt?: string;
  fileName?: string;
  className?: string;
};

export default function ImageView({
  src,
  alt,
  fileName,
  className,
}: ImageViewProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {error ? (
        <Error />
      ) : (
        <Image
          alt={alt || fileName || 'Image'}
          className={`h-full w-full border-none ${className}`}
          isLoading={loading}
          loading="eager"
          src={src}
          width={'100%'}
          onError={() => setError(true)}
          onLoad={() => setLoading(false)}
        />
      )}
    </div>
  );
}

function Error() {
  return (
    <div className="text-center text-danger-600">
      <p>Failed to load image.</p>
    </div>
  );
}
