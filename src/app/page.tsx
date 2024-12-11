/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';

import { hashImageProvider } from './utils/hash-image.provider';

import { useImageHashStore } from './stores/image-hash.store';

import './page.css';
import './assets/image-icon.png';

export default function NextImageHashApp() {
  // Initiate state for the app
  const adjustedImageUrl = useImageHashStore((state) => state.adjustedImageUrl);
  const adjustedImageHash = useImageHashStore((state) => state.adjustedImageHash);


  // Track the hextstring input & file selection
  const [targetHexstring, setTargetHexstring] = useState<string>("");
  const [adjustedImageName, setAdjustedImageName] = useState<string>("");
  const [selectedHashFile, setSelectedHashFile] = useState<null | File>(null);

  // Track the loading state & error message for the UI
  // Use these to show a loading spinner and error message
  // As user feedback
  const [isHashingImage, setIsHashingImage] = useState<boolean>(false);
  const [errorOccured, setErrorMessage] = useState<string>('');

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setSelectedHashFile(file);
    }
  };

  const handleHexstringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetHexstring(event.target.value);
  };

  const handleImageNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdjustedImageName(event.target.value);
  };

  const handleUpload = async () => {
    setErrorMessage("");

    if (!selectedHashFile || !targetHexstring) {
      setErrorMessage("Please select a file and enter a target prefix.");
      return;
    }

    setIsHashingImage(true);

    const hashedImageUrlRes = await hashImageProvider(selectedHashFile as File,
                                                      targetHexstring,
                                                      adjustedImageName);

    if (hashedImageUrlRes.status !== 200) {
      setErrorMessage(hashedImageUrlRes.errorMessage);
      setIsHashingImage(false);
      return;
    }

    // Update the image hash store with the new image hash
    useImageHashStore.setState({ 
      adjustedImageUrl: hashedImageUrlRes.result.imageUrl,
      adjustedImageHash: hashedImageUrlRes.result.hash
    });

    setErrorMessage("");
    setIsHashingImage(false);
  };

  // Copy the hash to the clipboard
  const copyHash = () => {
    if (adjustedImageUrl.length > 0) {
      navigator.clipboard.writeText(adjustedImageHash);
      alert("Hash copied to clipboard!");
    }
  };

  // Download the hashed image
  const downloadHashedImage = () => {
    if (adjustedImageUrl.length > 0) {
      const link = document.createElement('a');
      link.href = adjustedImageUrl;
      link.setAttribute('download', `${adjustedImageName}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    // Image Hash Express
    <div className="image-hash-body">

      <div className="header">
        <h1>Image Hash Express</h1>
      </div>

      <div className="hash-body">
        <div className="upload-hash">
          <h2>Protect Your Images in Seconds</h2>
          <p>Upload your image, hash it instantly, and ensure secure
            and tamper-proof data—all with just one click.
          </p>
          <input type="text"
            placeholder='Enter prefix.. i.e 0x5'
            value={targetHexstring} onChange={handleHexstringChange} disabled={isHashingImage} />
          <input type="text"
            placeholder='Enter hashed image name.. i.e altered-image'
            value={adjustedImageName} onChange={handleImageNameChange} disabled={isHashingImage} />
          <input type="file" id="file-input" accept="image/jpg"
            onChange={handleFileChange} disabled={isHashingImage} />

          <button id="upload-button" onClick={handleUpload} disabled={isHashingImage}>
            {isHashingImage ? "Processing..." : "Start Hashing Now"}
          </button>

          {errorOccured && <p className="error-message">{errorOccured}</p>}
        </div>

        <div className="view-hash">
          <div className="view-hash-header">
            <p>Your Hashed Image</p>
            <button onClick={downloadHashedImage}> Download </button>
          </div>
          <div className="view-hash-image">
            {adjustedImageUrl.length > 0 ? (
              <img src={adjustedImageUrl} alt="hashed image" />
            ) : (
              <div className="imagePlacholder">
                <p> Hashed image appears here. </p>
              </div>
            )}
          </div>
          <div className="view-hash-footer">
            <p>New Image Hash</p>
            <button onClick={copyHash}> Copy </button>
          </div>

          <p className="new-image-hash">
            { adjustedImageHash.length > 0 ? adjustedImageHash : '- No image hashed -'}
          </p>
        </div>
      </div>

      <div className="footer">
        <p>  Ian Odhiambo Obutho </p>
      </div>
    </div>
  );
}