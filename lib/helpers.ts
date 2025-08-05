/**
 * Trims a filename from the middle if it's too long.
 * @param name - The full filename (e.g. "longFileName.ts")
 * @param maxLength - Max total characters to display (default: 24)
 * @returns A nicely trimmed filename with extension preserved
 */

export function shrtn(name: string, maxLength = 24): string {
  if (name.length <= maxLength) return name;

  const extIndex = name.lastIndexOf('.');
  const hasExt = extIndex !== -1 && extIndex !== 0;

  const extension = hasExt ? name.slice(extIndex) : '';
  const baseName = hasExt ? name.slice(0, extIndex) : name;

  const visibleLength = maxLength - extension.length - 3; // 3 for "..."
  const front = Math.ceil(visibleLength / 2);
  const back = Math.floor(visibleLength / 2);

  return `${baseName.slice(0, front)}...${baseName.slice(-back)}${extension}`;
}

export function sanitizeUrlPath(urlPath: string) {
  return (
    decodeURIComponent(urlPath)
      // .replace(/\+/g, ' ') // Replace + with space
      // .replace(/[^a-zA-Z0-9 _\-]/g, '') // Strip anything not alphanum, space, underscore, hyphen, dot
      // .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim()
  ); // Remove leading/trailing whitespace
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function formatFileSize(bytes: number, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + ' ' + units[u];
}

import { newFolderPlaceholderMap } from '@/lib/newFolerPlaceholders';
import { UploadFileEntry } from '@/types';

export function getRandomFolderPlaceholder() {
  const all = [
    ...newFolderPlaceholderMap.ideas,
    ...newFolderPlaceholderMap.dev,
    ...newFolderPlaceholderMap.funny,
  ];

  return all[Math.floor(Math.random() * all.length)];
}
