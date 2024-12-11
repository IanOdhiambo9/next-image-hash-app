// Usage: This file contains the function to hash 
// the image using the cloud function.

import { functionUrls } from "../../../functions.config";

// Response: The response from the cloud function 
// is returned as a JSON object with the following properties:
export type THashImageProviderResponse = {
  status: number;
  result: {imageUrl: string, hash: string};
  errorMessage: string;
};

/**
 * Function to hash the image using the cloud function
 * @param selectedFile The selected image file
 * @param targetHexstring The target hexstring
 * @returns The response from the cloud function
 */
export const hashImageProvider = async (
  selectedFile: File,
  targetHexstring: string,
  adjustedImageName: string
): Promise<THashImageProviderResponse> => {
  const cloudFunctionUrl = functionUrls.HASH_IMAGE_REMOTE_URL;

  try {
    const res: THashImageProviderResponse = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          // Extract base64 from data URL
          const fileBase64 = (e.target as FileReader).result!.toString().split(",")[1];

          const payLoad = {
            targetPrefix: targetHexstring,
            image: fileBase64,
            adjustedImageName
          };

          // Send the image to the cloud function
          const response = await fetch(cloudFunctionUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payLoad),
          });

          if (!response.ok) {
            throw new Error("Failed to process the image. Please try again.");
          }

          // Parse the response as JSON
          const resData = await response.json();

          // Resolve with success response
          resolve({
            status: 200,
            result: {imageUrl: resData.url, hash: resData.hash},
            errorMessage: "",
          });
        } catch (error) {
          // Resolve with error response
          resolve({
            status: 500,
            result: {imageUrl: "", hash: ""},
            errorMessage: (error as Error).message,
          });
        }
      };

      reader.onerror = () => {
        reject({
          status: 500,
          imageUrl: "",
          errorMessage: "Failed to read the file.",
        });
      };

      reader.readAsDataURL(selectedFile);
    });

    return res;
  } catch (error) {
    return {
      status: 500,
      result: {imageUrl: "", hash: ""},
      errorMessage: (error as Error).message,
    };
  }
};