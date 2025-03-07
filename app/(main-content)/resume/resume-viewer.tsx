'use client';

import { useState, useEffect } from 'react';

interface ResumeViewerProps {
  pdfUrl: string;
}

export function ResumeViewer({ pdfUrl }: ResumeViewerProps) {
  const [height, setHeight] = useState('800px');

  useEffect(() => {
    // Update height based on viewport
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      setHeight(`${windowHeight * 0.8}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <iframe
      src={`${pdfUrl}#view=FitH`}
      style={{ width: '100%', height }}
      frameBorder="0"
      title="Resume"
      className="w-full"
    />
  );
}
