import { Button } from '@heroui/button';

import { UploadIcon } from '@/components/icons';

function Upload({ filePath }: { filePath: string }) {
  return (
    <form>
      <input multiple name="files" type="file">
        <Button endContent={<UploadIcon />} formMethod="post" type="submit">
          Upload
        </Button>
      </input>
      <input
        className="hidden"
        name="path"
        readOnly={false}
        type="text"
        value={filePath}
      />
    </form>
  );
}

export default Upload;
