export const uploadFileToCloudinary = (
  file: File,
  resourceType: 'image' | 'video' | 'auto' = 'auto',
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      reject(new Error('Cloudinary keys are missing. Please configure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'));
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName.trim().toLowerCase()}/auto/upload`;
    console.log('Sending Unsigned Upload to:', url);
    
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset.trim());
    // Cloudinary standard for unsigned upload only needs these 2 fields!

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        console.error('Cloudinary Upload Error Details:', {
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.responseText,
          cloudName,
          uploadPreset
        });
        try {
          const err = JSON.parse(xhr.responseText);
          const message = err.error?.message || `Upload failed: ${xhr.statusText}`;
          reject(new Error(`${message} (Status: ${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed: ${xhr.statusText} (${xhr.status})`));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error occurred during upload')));
    
    xhr.open('POST', url, true);
    xhr.send(formData);
  });
};
