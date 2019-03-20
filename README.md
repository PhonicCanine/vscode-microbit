# microbit README

Basic support for micro:bit with MicroPython in Visual Studio Code.

## Features

Allows code to be compiled onto a micro:bit, and also provides a basic stub of the micro:bit library, so that you can take advantage of Visual Studio Code's features, like Intellisense.

![intellisense support](https://github.com/PhonicCanine/vscode-microbit/blob/master/images/img1.jpg?raw=true)

Adds two commands to Visual Studio Code: Fetch and Build,

![commands](https://github.com/PhonicCanine/vscode-microbit/blob/master/images/img2.jpg?raw=true)

Fetch will get the stub micro:bit module from Github, and Build builds the current file to your micro:bit. Build uses Control + F5 by default on Windows, and Command + F5 on MacOS, but may also be accessed from the title bar, when editing python programs.

## Requirements

### To build

* Python 3
    * Pip
        * uflash

### And if you'd like to use the stub library:

* GIT

It may also be found here, though: https://github.com/PhonicCanine/microbit

Python and Pip must be in your PATH variable. Aside from these three dependencies everything else should work for compiling.

### A note about directory naming:

Please note that if you plan on using the "Fetch microbit modules" command, and you have a folder inside your workspace named "microbit", it will be deleted!

## Other

This extension is also on GitHub: https://github.com/PhonicCanine/vscode-microbit, please file any issues there.

Thank you.

### 0.1.0

Initial release
-----------------------------------------------------------------------------------------------------------

### 0.2.0

Extension is now compatible with PyLint.
Extension now allows fetching modules even if the root project folder is named "microbit"

