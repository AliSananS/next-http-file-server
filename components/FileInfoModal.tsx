import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';
import { Tooltip } from '@heroui/tooltip';
import { useState } from 'react';
import clsx from 'clsx';

import { DirEntry, FileEntry } from '@/types';
import { formatFileSize } from '@/lib/helpers';
import { modal } from '@/components/sharedStyles';

export function FileInfoModal({
  isOpen,
  onClose,
  file,
}: {
  isOpen: boolean;
  onClose: () => void;
  file: FileEntry | DirEntry;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1000);
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="group flex flex-col gap-1 py-1">
      <div>
        <p className="text-sm text-default-400">{label}</p>
      </div>
      <Tooltip
        showArrow
        content={copiedField === label ? 'Copied!' : 'Copy'}
        placement="top"
      >
        <button
          className="flex w-fit items-start"
          onClick={() => copyToClipboard(label, value)}
        >
          <p className="break-all text-sm font-light text-default-900 hover:text-default-700 hover:underline">
            {value}
          </p>
        </button>
      </Tooltip>
    </div>
  );

  const formatDate = (d: string | number | Date | undefined) =>
    d ? new Date(d).toLocaleString() : 'N/A';

  return (
    <Modal
      backdrop="blur"
      classNames={{ base: clsx(modal?.base) }}
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
        },
        transition: { duration: 0.2 },
      }}
      size="md"
      onOpenChange={onClose}
    >
      <ModalContent className="rounded-xl shadow-2xl">
        <ModalHeader>File Info</ModalHeader>

        <ModalBody className="space-y-2">
          <InfoRow label="Name" value={file.name} />
          <InfoRow label="Path" value={file.path} />
          {file.type !== 'dir' && (
            <InfoRow label="Size" value={formatFileSize(file.size, false)} />
          )}
          <div className="mt-2 pt-2">
            <InfoRow label="Created" value={formatDate(file.time?.create)} />
            <InfoRow label="Modified" value={formatDate(file.time?.modified)} />
            <InfoRow label="Accessed" value={formatDate(file.time?.access)} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
