import { useState } from 'react'

import type { UploadFileType } from '@/types/component-props'
import { formatFileSize } from '@/utils/other'

export default function useFileUploader(showPreview: boolean = true) {
  const [selectedFiles, setSelectedFiles] = useState<UploadFileType[]>([])
  
  const handleAcceptedFiles = (files: File[], callback?: (files: File[]) => void) => {
    let allFiles: File[] = [];
  
    if (showPreview) {
      files = files.map((file) => {
        // Annotate without converting File
        (file as any).preview = file.type.startsWith('image') ? URL.createObjectURL(file) : undefined;
        (file as any).formattedSize = formatFileSize(file.size);
        return file;
      });
  
      allFiles = [...selectedFiles, ...files];
      setSelectedFiles(allFiles);
    } else {
      allFiles = [...selectedFiles, ...files];
    }
  
    if (callback) callback(allFiles);
  };
  

  const removeFile = (file: UploadFileType) => {
    const newFiles = [...selectedFiles]
    newFiles?.splice(newFiles.indexOf(file), 1)
    setSelectedFiles(newFiles)
  }

  return {
    selectedFiles,
    handleAcceptedFiles,
    removeFile,
  }
}
