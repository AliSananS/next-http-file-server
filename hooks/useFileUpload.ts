import { useState, useRef, useCallback } from 'react';

import { log } from '@/lib/log';

type UploadCallback = (err: string | null, res?: any) => void;

interface UseFileUploadReturn {
  upload: (
    file: File,
    url: string,
    path: string,
    onComplete?: UploadCallback,
  ) => void;
  progress: number;
  abort: () => void;
  isUploading: boolean;
}

export function useFileUpload(): UseFileUploadReturn {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const upload = useCallback(
    (file: File, url: string, path: string, onComplete?: UploadCallback) => {
      const xhr = new XMLHttpRequest();

      xhrRef.current = xhr;

      xhr.open('POST', url);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        setIsUploading(false);

        const contentType = xhr.getResponseHeader('Content-Type');
        let responseData: any = xhr.responseText;

        if (contentType && contentType.includes('application/json')) {
          try {
            responseData = JSON.parse(xhr.responseText);
          } catch {}
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          onComplete?.(null, responseData);
        } else {
          onComplete?.(
            typeof responseData === 'string'
              ? responseData
              : responseData?.error || 'Upload failed',
            responseData,
          );
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        onComplete?.('Network error');
      };

      xhr.onabort = () => {
        setIsUploading(false);
        setProgress(0);
      };

      const formData = new FormData();

      formData.append('files', file);
      formData.append('path', path);

      setIsUploading(true);
      setProgress(0);
      xhr.send(formData);
    },
    [],
  );

  const abort = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
    }
  }, []);

  return { upload, progress, abort, isUploading };
}
