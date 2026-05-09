'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadImageFile } from '@/lib/uploadImage';
import { toast } from 'sonner';
import { ImagePlus, Loader2 } from 'lucide-react';

type ImageUploadButtonProps = {
  folder?: string;
  label?: string;
  onUploaded: (url: string) => void;
  className?: string;
};

export function ImageUploadButton({
  folder = 'misc',
  label = 'Upload image',
  onUploaded,
  className,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setPending(true);
    try {
      const { url } = await uploadImageFile(file, folder);
      onUploaded(url);
      toast.success('Image uploaded');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Upload failed (configure Cloudinary on the server)';
      toast.error(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
      <Button
        type="button"
        variant="outline"
        className={className}
        disabled={pending}
        onClick={() => inputRef.current?.click()}
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />}
        {label}
      </Button>
    </>
  );
}
