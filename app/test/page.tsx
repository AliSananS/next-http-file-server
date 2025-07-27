'use client';

import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { Input } from '@heroui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import React, { useState } from 'react';

function Test() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <div>
      <Dropdown closeOnSelect={false}>
        <DropdownTrigger>Open dropdown</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="key">
            <Popover isOpen={isPopoverOpen}>
              <PopoverTrigger>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => setIsPopoverOpen(true)}
                />
              </PopoverTrigger>
              <PopoverContent>
                <Input defaultValue="SomeFileName" />
              </PopoverContent>
            </Popover>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default Test;
