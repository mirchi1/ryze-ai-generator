"use client";
import React from 'react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { RYZE_COMPONENTS } from './library/UIComponents';

interface PreviewerProps {
  code: string;
}

export default function Previewer({ code }: PreviewerProps) {
  return (
    <div className="w-full h-full border rounded-lg bg-white p-4 overflow-auto">
      <LiveProvider code={code} scope={RYZE_COMPONENTS} noInline={false}>
        <div className="mb-2 text-xs font-bold text-gray-400 uppercase">Live Result:</div>
        <LivePreview />
        <div className="mt-4 text-red-500 text-xs">
          <LiveError />
        </div>
      </LiveProvider>
    </div>
  );
}