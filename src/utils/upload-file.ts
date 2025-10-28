import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import uuidv4 from './uuidv4';
import type { FileData } from '../types/files';

// ----------------------------------------------------------------------

type ModelPath = 'categories' | 'faq' | 'articles' | 'products' | 'users';

interface UploadFileOptions {
  file: File;
  model: ModelPath;
}

/**
 * Gets the file extension from a filename
 * @param filename - The filename
 * @returns string - The file extension with dot (e.g., '.png')
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot) : '';
}

/**
 * Uploads a file to Amplify S3 storage and returns FileData format
 * @param options - File upload options
 * @returns Promise<FileData> - File data in Shrine-like format
 */
export async function uploadFileToStorage({
  file,
  model,
}: UploadFileOptions): Promise<FileData> {
  const uuid = uuidv4();
  const extension = getFileExtension(file.name);
  const fileName = `assets/${model}/${uuid}${extension}`;

  try {
    // Upload the file to S3 using the new path-based API
    await uploadData({
      path: fileName,
      data: file,
      options: {
        contentType: file.type,
      },
    });

    // Return the FileData format (Shrine-like structure)
    return {
      id: fileName,
      storage: 's3',
      metadata: {
        filename: file.name,
        mime_type: file.type,
        size: file.size,
      },
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file to storage');
  }
}

// ----------------------------------------------------------------------

/**
 * Deletes a file from Amplify S3 storage
 * @param path - The storage path of the file
 */
export async function deleteFileFromStorage(path: string): Promise<void> {
  try {
    await remove({ path });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file from storage');
  }
}

// ----------------------------------------------------------------------

/**
 * Gets a signed URL for a file from storage
 * @param path - The storage path of the file
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Promise<string> - The signed URL
 */
export async function getFileUrl(
  path: string,
  expiresIn = 3600
): Promise<string> {
  try {
    const { url } = await getUrl({
      path,
      options: {
        expiresIn,
      },
    });
    return url.toString();
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw new Error('Failed to get file URL from storage');
  }
}
