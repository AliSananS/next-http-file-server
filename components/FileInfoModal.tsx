import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { useState } from 'react';

import { CopyIcon } from '@/components/icons'; // Or use your own icon
import { DirEntery, FileEntry } from '@/types';

export function FileInfoModal({
  isOpen,
  onClose,
  file,
}: {
  isOpen: boolean;
  onClose: () => void;
  file: FileEntry | DirEntery;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1000);
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="group flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm text-default-400">{label}</p>
        <p className="break-all text-base font-medium text-default-900">
          {value}
        </p>
      </div>
      <Tooltip
        showArrow
        className="text-xs"
        content={copiedField === label ? 'Copied!' : 'Copy'}
        placement="top"
      >
        <button
          className="opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => copyToClipboard(label, value)}
        >
          <CopyIcon className="text-default-400 hover:text-primary" size={16} />
        </button>
      </Tooltip>
    </div>
  );

  return (
    <Modal
      backdrop="blur"
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
        <ModalHeader className="flex flex-col gap-1">
          File Info
          <span className="text-sm font-normal text-default-500">
            Everything you need to know 🕵️‍♂️
          </span>
        </ModalHeader>

        <ModalBody className="space-y-2">
          <InfoRow label="Name" value={file.name} />
          <InfoRow label="Path" value={file.path} />
          {file.type !== 'dir' && (
            <InfoRow
              label="Size"
              value={`${(file.size / 1024).toFixed(2)} KB`}
            />
          )}
          <InfoRow
            label="Last Modified"
            value={new Date(file.time?.modified || 'N/A').toLocaleString()}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            className="text-default-500"
            variant="light"
            onPress={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
