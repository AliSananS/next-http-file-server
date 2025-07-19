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
