'use client';

import path from 'path';

import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import Image from 'next/image';

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
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <Card
      className={`min-h-full w-full min-w-full max-w-full rounded-xl border-1 border-solid border-divider bg-white dark:bg-black ${className || ''}`}
    >
      {fileName && (
        <CardHeader>
          <div className="mb-2 text-base font-semibold text-default-700">
            {fileName}
          </div>
        </CardHeader>
      )}
      <CardBody className="flex flex-col items-center justify-center p-0">
        <div className="relative flex min-h-64 w-full items-center justify-center overflow-auto">
          <div className="flex h-full max-h-full w-full max-w-full items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              // unoptimized
              alt={alt || fileName || 'Image'}
              // className={`shadow ${loading ? 'invisible' : 'visible'}`}
              draggable={false}
              // height={0}
              // sizes="100vw"
              src={src}
              // style={{
              // 	maxWidth: '100%',
              // 	maxHeight: '100%',
              // 	height: 'auto',
              // 	width: 'auto',
              // 	display: loading ? 'none' : 'block',
              // }}
              // width={0}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
              onLoad={() => setLoading(false)}
            />
          </div>
        </div>
      </CardBody>
    </Card>
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
