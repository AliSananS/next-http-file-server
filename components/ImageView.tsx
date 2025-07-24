'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { Image } from '@heroui/image';

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

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true);

  return (
    <>
    {error && <Error />}
    {loading && <Loading />}
    <Card isBlurred>
      <Image 
      src={src}
      alt={alt}
      className={`border-none ${className} ${loading ? 'block' : 'hidden'}`}
      />
    </Card>
    </>
  );
}

function Loading() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-default-100/50">
      <Spinner color="primary" size="lg" />
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
