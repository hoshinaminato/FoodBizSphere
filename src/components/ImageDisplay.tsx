import React, { useState, useEffect } from 'react';
import { loadImage } from '../lib/storage';

interface ImageDisplayProps {
  imageKey: string;
  className?: string;
  alt?: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageKey, className, alt }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const resolvedUrl = await loadImage(imageKey);
      if (isMounted && resolvedUrl) {
        setUrl(resolvedUrl);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [imageKey]);

  if (!url) {
    return <div className={`bg-neutral-100 animate-pulse ${className}`} />;
  }

  return (
    <img 
      src={url} 
      alt={alt || "图片"} 
      className={className}
      referrerPolicy="no-referrer"
    />
  );
};
