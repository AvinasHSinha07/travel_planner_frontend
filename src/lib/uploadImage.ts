import axiosInstance from '@/lib/axiosInstance';

export async function uploadImageFile(file: File, folder?: string): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('image', file);
  if (folder) formData.append('folder', folder);

  const res = await axiosInstance.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.data as { url: string; publicId: string };
}
