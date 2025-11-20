import imageCompression, { Options } from 'browser-image-compression';
import type { Quality, Size } from './types';

const worker: Worker = self as any;

export interface WorkerRequest {
  id: string;
  payload: {
    image: File;
    maxWidthOrHeight?: Size;
    quality?: Quality;
  };
}

function humanFileSize(bytes: number, si = true) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
}

async function resizeImage({
  image,
  quality = 80,
  maxWidthOrHeight,
}: WorkerRequest['payload']) {
  const start = +new Date();
  console.log(`Start resize file: ${image.name}`);

  try {
    const options: Options = {
      // API Gateway permite hasta 5MB, pero dejamos un margen
      maxSizeMB: 3,
      initialQuality: quality / 100, // Convertir de 1-100 a 0-1
      fileType: 'image/webp',
      alwaysKeepResolution: false,
      useWebWorker: false, // Ya estamos en un worker
      maxWidthOrHeight,
    };

    const compressedFile = await imageCompression(image, options);

    const end = +new Date();

    console.table({
      name: image.name,
      sizeOriginal: humanFileSize(image.size),
      newSize: humanFileSize(compressedFile.size),
      reduction: `${((image.size - compressedFile.size) / image.size) * 100}%`,
      totalTime: `${(end - start) / 1000} seg`,
    });

    return compressedFile;
  } catch (error) {
    console.error(
      'Error resizing image with browser-image-compression:',
      error,
    );
    return image;
  }
}

worker.addEventListener('message', async event => {
  const data: WorkerRequest = event.data;
  const { payload, id } = data;
  worker.postMessage({
    image: await resizeImage(payload),
    id,
  });
});
