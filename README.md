How to Run Your Application
This guide will walk you through checking for Node.js, installing it if needed, and running your server.

Step 1: Check if Node.js is Installed
First, let's see if you already have Node.js on your computer.

Open your terminal (Command Prompt on Windows, or Terminal on Mac).

Type the following command and press Enter:

Bash

node -v
Review the result:

✅ If a version number appears (like v20.11.1), Node.js is installed. You can skip to Step 3.

❌ If you see an error like 'node' is not recognized..., Node.js is not installed. Proceed to Step 2.

Step 2: Install Node.js (If Necessary)
If the check in Step 1 failed, you need to install Node.js.

Go to the Official Website: Open your browser and navigate to https://nodejs.org/.

Download the Installer: Click on the download button for the version labeled LTS (Long-Term Support). This is the most stable and recommended version.

Run the Installer: Open the downloaded file and follow the on-screen instructions.

Ensure "Add to PATH" is Selected: During installation, you will see several options. Make sure the option "Add to PATH" is checked. This is usually enabled by default and is crucial for the node command to work in your terminal.

Restart Your Terminal: After the installation is complete, close your current terminal window and open a new one. This is a critical step that allows the system to recognize the new installation.

Step 3: Run Your Application
Now that Node.js is installed and ready, you can start your application.

Open a New Terminal: If you haven't already, open a fresh terminal window.

Navigate to Your Project Folder: Use the cd (change directory) command to move into your project's root folder. For example, if your folder is on the Desktop, you would type:

Bash

cd Desktop/gemini-voice-app
Start the Server: Once you are inside the correct folder, run the following command:

Bash

node server.js
Confirm It's Running: The terminal should display the message: Server is listening on http://localhost:3000. This confirms your server is active.

View in Browser: Open your web browser and go to the address http://localhost:3000 to see and use your application.
