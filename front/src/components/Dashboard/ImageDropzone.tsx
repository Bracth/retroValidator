import React from 'react';

interface ImageDropzoneProps {
  label: string;
  imageUrl?: string;
  onUpload: (file: File) => void;
  status: 'idle' | 'pending' | 'success' | 'fail';
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  label,
  imageUrl,
  onUpload,
  status,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className={`dropzone status-${status}`}>
      <h3>{label}</h3>
      {imageUrl ? (
        <img src={imageUrl} alt={label} className="dropzone-preview" />
      ) : (
        <div className="dropzone-placeholder">
          <p>DROP IMAGE OR CLICK TO UPLOAD</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
        </div>
      )}
      <div className="status-indicator">
        {status === 'pending' && 'ANALYZING...'}
        {status === 'success' && 'VERIFIED'}
        {status === 'fail' && 'REJECTED'}
        {status === 'idle' && 'READY'}
      </div>
    </div>
  );
};
