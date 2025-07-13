import React from 'react';

function PreviewFile({ filePath }: { filePath: string[] }) {
  console.log(filePath);

  return (
    <div>
      <p className="text-black">{filePath}</p>
    </div>
  );
}

export default PreviewFile;
