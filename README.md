# Image Hash Express

Welcome to **Image Hash Express**, a web application that simplifies the process of hashing images with a user-friendly interface. This app allows users to upload an image, provide a custom hex string, and output a hash-adjusted image with a hash that starts with the specified prefix.

The app is hosted at [next-image-hash.web.app](https://next-image-hash.web.app/).

---

## **Table of Contents**

1. [Project Overview](#project-overview)
2. [Mockups and Design](#mockups-and-design)
3. [Features](#features)
4. [Technical Details](#technical-details)
5. [Setup and Installation](#setup-and-installation)
6. [Usage Guide](#usage-guide)
7. [Technologies Used](#technologies-used)
8. [Future Improvements](#future-improvements)

---

## **Project Overview**

**Image Hash Express** was built to provide an intuitive interface for performing a previously terminal-based image hashing operation. This app caters to users who require custom image hashes for a variety of applications while ensuring the original image is visually unaltered.

---

## **Mockups and Design**

### **Figma Designs**

The app's design journey began with wireframes and mockups created in Figma. These designs focused on:
- A clean and minimalistic user interface.
- Easy navigation for users.
- Accessibility and responsiveness across all devices.

![Figma protoype link](https://www.figma.com/proto/6c0JUhLoIl7TmPfZcYsLi6/Image-Hash-Web?node-id=0-1&t=fyeYYoeerCU26lwW-1)


### **Design Highlights**
- **Three Input Fields:**
  1. Hex String
  2. Output File Name
  3. Image to Hash (upload)

- **Interactive Buttons:**
  - Start Hashing
  - Download Image
  - Copy Hash

- **Result Display Section:**
  - Showcases the adjusted image.
  - Displays the new hash value.

---

## **Features**

### **User Inputs:**
- **Hex String:** The prefix for the hash.
- **Output Name:** Desired name for the generated image.
- **Image Upload:** Supports common image formats (JPG, etc.).

### **Hashing Functionality:**
- Computes an adjusted hash using a Firebase Cloud Function.
- Generates a visually identical image with the new hash.
- Saves the adjusted image to Google Cloud Storage.

### **Result Section:**
- Displays the adjusted image.
- Shows the computed hash value.
- Includes:
  - A button to **download the image**.
  - A button to **copy the hash value**.

### **State Management:**
- Utilizes **Zustand** for managing the image and hash values locally.
- Ensures data persists even when the page is refreshed.

---

## **Technical Details**

### **Backend:**
- Firebase Cloud Functions handle the hashing process.
- The function appends random bytes to the uploaded image until the hash matches the provided hex string.
- Saves the adjusted image in Google Cloud Storage and returns the public URL and hash value.

### **Frontend:**
- Built with **Next.js** for fast and efficient rendering.
- Zustand store ensures that the application state (image and hash) is maintained during the user's session.

---

## **Setup and Installation**

### **Prerequisites:**
- Node.js (v16 or later)
- Firebase CLI

### **Installation Steps:**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/image-hash-express.git
   cd image-hash-express
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   ```bash
   firebase login
   firebase init
   ```
   - Set up hosting and functions as required.

4. Deploy the Firebase Cloud Function:
   ```bash
   firebase deploy --only functions
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the app at `http://localhost:3000`.

---

## **Usage Guide**

1. Visit the app at [next-image-hash.web.app](https://next-image-hash.web.app/).
2. Fill in the inputs:
   - Enter a **Hex String** (e.g., `0x24`).
   - Specify an **Output Name** for the resulting image.
   - Upload the **Image** to hash.
3. Click **Start Hashing**.
4. Review the results:
   - Adjusted image is displayed.
   - Hash value is shown.
5. Use the buttons to:
   - **Download the adjusted image**.
   - **Copy the hash value**.

---

## **Technologies Used**

- **Frontend:** Next.js, React, Zustand
- **Backend:** Firebase Cloud Functions, Google Cloud Storage
- **Design:** Figma
- **State Management:** Zustand
- **Deployment:** Firebase Hosting

---

## **Future Improvements**

- Add support for batch image uploads.
- Implement additional hash algorithms (e.g., SHA256, SHA1).
- Enhance user experience with real-time progress indicators.
- Support custom image dimensions and formats.

---

Thank you for using **Image Hash Express**! Contributions, issues, and suggestions are welcome.