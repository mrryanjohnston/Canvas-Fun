# Card Gamer
## Why
Why not?
## What
Javascript, [node.js](http://www.nodejs.org),
[socket.io](http://www.socket.io),
[express](http://www.expressjs.com),
[MongoDB](http://www.mongodb.org),
[jQuery](http://jquery.com/), 
[Kinetic.js](http://www.kineticjs.com/),
[Twitter Bootstrap](http://twitter.github.io/bootstrap).

## Installation

    git clone https://github.com/mrryanjohnston/Canvas-Fun
    cd Canvas-Fun
    npm preinstall
    npm install

## Controlling the application

Start and stop the application as a long running process, respectively:

    npm start
    npm stop

Start the server as a short running process

    npm test

## Problems
###Node Version
Your version of nodejs might be incompatible with mongoose or another package. This project uses v0.8.19. You can get that by installing node and setting node versions via nvm:

    curl https://raw.github.com/creationix/nvm/master/install.sh | sh
    restart terminal
    nvm install v0.8.19
    nvm use v0.8.19

###NPM Version
Your version of npm might be incompatible with mongoose or another package. We're using v1.2.10.

    npm install npm@1.2.10 -g
    
###Mongoose package
Mongoose can be a butt. You may need to install it prior to running npm install.

    npm install mongoose
    npm install
    
###MongoDB setup
You'll need to have a copy of mongodb running a database. We recommend using [mongoctl](http://github.com/mongolab/mongoctl). Install python, build tools, and pip. Pick one of the follow based on your OS/distro:

    sudo apt-get install python build-essential python-pip
    sudo pacman -S base-devel python python-pip (should test this too)
    sudo yum install python python-pip build-essential ??? (need to test this)

Then:

    sudo pip install mongoctl
    create mongoctl config, server config, cluster config
    mongoctl install-mongodb 2.2.3
    mongoctl start [servername]

## Misc.
Card sprite provided by [Brandon Ardiente](http://ardisoft.net/svg-z-cards/) under the LGPL.  
Followed the tutorials by [Eric Rowell](http://www.html5canvastutorials.com/kineticjs/html5-canvas-events-tutorials-introduction-with-kineticjs/).  
Twitter Bootstrap theme [United](http://bootswatch.com/united).  
[Sticky footer](http://twitter.github.io/bootstrap/examples/sticky-footer.html) by Marty Bean and Ryan Fait.

## License
Copyright (c) 2013, Ryan Johnston, L Gabriel Miller
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
