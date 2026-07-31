# HyperShare ⚡️

HyperShare is a completely local, high-speed file transfer web application built to maximize bandwidth between your PC and mobile devices over Wi-Fi (especially Wi-Fi 6).

By completely avoiding cloud relays, TLS overhead, and multipart form-data parsing, HyperShare is capable of achieving near-gigabit speeds on modern local networks.

## Features

- **Blazing Fast**: Streams raw binary data directly to disk without loading it into RAM first.
- **No Setup Needed**: Run the `.exe` and it instantly starts.
- **Zero Install on Phone**: Just open the local IP address on your phone's browser.
- **Customizable Folder**: Drag and drop any folder onto the executable, or run via command line to change the sharing location.
- **Premium UI**: Sleek glassmorphism design with real-time transfer speeds and progress bars.

## How to use

### Standard Usage
1. Go to the [Releases](../../releases) tab on this GitHub repository and download the `HyperShare.exe` file.
2. Double click `HyperShare.exe`.
3. A command prompt will open, displaying an IP address (e.g., `http://192.168.1.37:3000`).
4. Make sure your phone is connected to the same Wi-Fi network.
5. Open your phone's browser and go to that IP address.
6. Drop files into the UI to send them to the PC, or download files from the PC.

*By default, the app shares a folder called `uploads` in the exact same directory where you placed `HyperShare.exe`.*

### Custom Sharing Folder
If you want to share a specific folder (like your Downloads folder), simply drag and drop that folder directly onto the `HyperShare.exe` icon in Windows. It will open and share that folder instead!

Alternatively, you can run it via command line:
```cmd
HyperShare.exe "C:\Users\YourName\Downloads"
```

## How to build from source

If you want to build the executable yourself instead of using the provided release:

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` (or `npx pkg . --targets node18-win-x64 --output HyperShare.exe`).

## Technologies Used
- Node.js (Express, raw HTTP streaming)
- HTML/CSS/Vanilla JS (Frontend UI)
- `pkg` (Executable bundling)
