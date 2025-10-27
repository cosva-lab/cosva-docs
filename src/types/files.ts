// ----------------------------------------------------------------------

export type FileData = {
  id: string;
  storage: string;
  metadata: {
    filename: string;
    mime_type: string;
    size: number;
    width?: number;
    height?: number;
  };
  urls: {
    original: string;
    thumb: string;
  };
};

