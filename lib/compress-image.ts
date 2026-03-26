/**
 * Professional Image Compression Utility
 * Limits file size to ~100KB using smart canvas scaling
 */

export async function compressImage(file: File, maxKB = 100): Promise<File> {
  if (file.size / 1024 < maxKB) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio but downscale if very large
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height *= maxDim / width;
            width = maxDim;
          } else {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context failed"));

        ctx.drawImage(img, 0, 0, width, height);

        // Recursive quality reduction
        let quality = 0.8;
        const attemptCompression = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Blob conversion failed"));

              if (blob.size / 1024 <= maxKB || quality <= 0.1) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                quality -= 0.1;
                attemptCompression();
              }
            },
            "image/jpeg",
            quality
          );
        };

        attemptCompression();
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
