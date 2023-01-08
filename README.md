
# TeFi App

  

**Instructions to use**

**Step1:**
  

 1. Clone the repo.
 2. Run `npm install` in the root directory.

**Step2:**
   Compile required dependencies from the packages directory.
   Open the  packages directory and inside each directory:
   

 1. Install Dependencies using `npm run install` and then `npm run build`
 2. Run `npm pack` to create a .tgz file
 3. Link the package file to the root package.json using file path e.g. `"@contco/editor": "file:packages/editor/contco-editor-v1.1.17.tgz"`

**Step3:**

 1. Run `npm run dev`
 2. Open [http://localhost:3003](http://localhost:3003) on your browser.