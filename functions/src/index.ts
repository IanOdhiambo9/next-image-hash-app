// Firebase Functions SDK to create Cloud Functions and trigger them with HTTP requests
import * as functions from "firebase-functions";

// Node.js Crypto module for generating random bytes and hashes
import * as crypto from "crypto";

// Google Cloud Storage SDK for interacting with Firebase Storage
import { Storage } from "@google-cloud/storage";

// Instantiate the Storage client for Firebase Cloud Storage
// My Firebase Storage bucket name
const storage = new Storage();
const bucketName = "chui-app-io.appspot.com";

/**
 * Adjust the hash of the image buffer by appending random bytes until the hash starts with the target prefix.
 * 
 * @param fileBuffer The file's buffer (binary data) that we want to adjust the hash of.
 * @param targetPrefix The hexadecimal string that the hash of the file must start with.
 * @returns The adjusted image cloud url and new hash with the desired hash prefix.
 */
async function adjustHash(fileBuffer: Buffer, 
                          targetPrefix: string): Promise<{adjustedBuffer: Buffer, hash: string}> {

  // Logs the target prefix and the original file size (For easier debugging)
  functions.logger.info("Adjusting hash to start with prefix:", targetPrefix);
  functions.logger.info("Original file size:", fileBuffer.length);

  // Makes a copy of the buffer to avoid mutating the original one
  let adjustedBuffer = Buffer.from(fileBuffer);

  // Variable to store the computed hash
  let hash = "";

  // Loops until the hash starts with the targetPrefix
  while (!hash.startsWith(targetPrefix)) {
    // Generates a random byte and appends it to the buffer
    // Generate 1 random byte using the crypto module
    const randomByte = crypto.randomBytes(1);

    // Concatenate the random byte to the buffer
    adjustedBuffer = Buffer.concat([adjustedBuffer, randomByte]);

    // Calculate the hash of the updated buffer using SHA-512
    // Update the hash and convert it to a hexadecimal string
    hash = crypto.createHash("sha512").update(adjustedBuffer).digest("hex");
  }

  // Return the updated buffer with the correct hash prefix
  return { adjustedBuffer, hash };
}

/**
 * Firebase cloud Function to handle HTTP requests for adjusting the image hash.
 * 
 * @param req The request object containing the target prefix and the base64-encoded image.
 * @param res The response object to send the result or error.
 */
export const adjustHashFunction = functions.https.onRequest(async (req: any, res: any) => {
  // I'm setting CORS headers manually to allow requests from my frontend application
  // Allow POST and OPTIONS methods
  // Allow Content-Type header
  res.set("Access-Control-Allow-Origin", "https://next-image-hash.web.app");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle for preflight requests (OPTIONS request)
  // Respond with 204 No Content for OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    // Destructure the targetPrefix and the image (binary data) from the request body
    let { targetPrefix, image, adjustedImageName } = req.body;

    // Check if targetPrefix or image are missing in the request
    if (!targetPrefix || !image || !adjustedImageName) {
      return res.status(400).json({ error: "Missing 'targetPrefix', 'adjusted image name' or 'image' in request body." });
    }

    // Remove '0x' prefix if present
    if (targetPrefix.startsWith("0x") || targetPrefix.startsWith("0X")) {
      targetPrefix = targetPrefix.slice(2);
    }

    // Validate that targetPrefix is a valid hexadecimal string
    if (!/^[0-9a-fA-F]+$/.test(targetPrefix)) {
      return res.status(400).json({ error: "'targetPrefix' must be a valid hexadecimal string." });
    }

    // Decode the base64-encoded file into a buffer
    const fileBuffer = Buffer.from(image, "base64");

    // Call the adjustHash function to modify the image's buffer to match the hash prefix
    const {adjustedBuffer, hash} = await adjustHash(fileBuffer, targetPrefix);

    // Generate a unique image name with a timestamp to avoid overwriting existing images
    const fileName = `${adjustedImageName}-${Date.now()}.jpg`;

    // Reference to Firebase Storage bucket
    const bucket = storage.bucket(bucketName);

    // Reference to the specific image within the bucket
    const fileRef = bucket.file(fileName);

    // Save the altered buffer to Firebase Storage
    await fileRef.save(adjustedBuffer, { resumable: false });

    // Generate a public URL to access the uploaded image
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    // Send the response with the public URL of the uploaded image
    res.status(200).json({ url: publicUrl, hash: hash });
  } catch (error) {
    // Log any errors to the Firebase console
    console.error("Error processing request:", error);
    // Return an internal server error response
    res.status(500).json({ error: "Internal server error." });
  }
});