# HyperShare

A local, high-speed file transfer application that streams files between a PC and mobile devices over Wi-Fi. Bypasses cloud relays, TLS overhead, and multipart form parsing to achieve near-gigabit throughput on modern local networks.

## Requirements

- Node.js 18+

## Installation

```sh
git clone https://github.com/innocous06/HyperShare.git
cd HyperShare
npm install
```

Alternatively, download the pre-built `HyperShare.exe` from the Releases tab and run it directly.

## Usage

```sh
npm start
```

The server starts and displays a local IP address (e.g. `http://192.168.1.37:3000`). Open that address in a browser on any device connected to the same Wi-Fi network.

To share a specific folder, pass it as an argument:

```sh
node server.js "C:\Users\YourName\Downloads"
```

Or drag and drop a folder onto `HyperShare.exe` on Windows.

By default, the app shares an `uploads` folder in the same directory as the executable.

## Building from source

```sh
npm run build
```

This produces a self-contained `HyperShare.exe` using `pkg`.

## License

MIT License

Copyright (c) 2024 innocous06

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
