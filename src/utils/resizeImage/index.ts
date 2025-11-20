import { v4 as uuidV4 } from 'uuid';

import WorkerResizeImage from './workerResizeImage?worker';
import type { WorkerRequest } from './workerResizeImage';
import type { Quality, Size } from './types';

const worker: Worker = window.Worker && new WorkerResizeImage();

interface ImageResizeOptions {
  maxWidthOrHeight?: Size;
  quality?: Quality;
}

export async function resizeImage(
  image: File,
  { maxWidthOrHeight, quality = 80 }: ImageResizeOptions = {},
) {
  if (!worker) return image;

  const id = uuidV4();

  return new Promise<File>(resolve => {
    const request: WorkerRequest = {
      id,
      payload: {
        image,
        maxWidthOrHeight,
        quality,
      },
    };

    worker.postMessage(request);

    const listener = ({ data }: MessageEvent) => {
      if (data.id === id) {
        resolve(data.image || image);
        worker.removeEventListener('message', listener);
      }
    };

    worker.addEventListener('message', listener);
  }).catch(() => image);
}

export async function resizeImages(
  images: File[],
  options?: ImageResizeOptions,
) {
  if (!images || images.length === 0) return images;
  const resizedImages = await Promise.all(
    images.map(image => resizeImage(image, options)),
  );
  return resizedImages;
}

export default resizeImages;
