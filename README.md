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

The only other important note is that this does *NOT* play nicely with PyLint, so if you would like to use the stub-module (for Intellisense), you'll need to disable pylint on the project.

## Other

This extension is also on GitHub: https://github.com/PhonicCanine/vscode-microbit, please file any issues there.

Thank you.

### 1.0.0

Initial release
-----------------------------------------------------------------------------------------------------------
