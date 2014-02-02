# Card Gamer
## Why
Ever wanted to play cards interactively over the internet? Now you can. Synergy.
## What
Lots of Javascript stuff.
 * [node.js](http://www.nodejs.org)
 * [socket.io](http://www.socket.io)
 * [express](http://www.expressjs.com)
 * [Angular.js](http://angularjs.org)
 * [Kinetic.js](http://www.kineticjs.com/)

And some other convenient stuff too:
 * [Compass](http://www.compass-style.org/)
 * [Twitter Bootstrap](http://twitter.github.io/bootstrap)
 * [Redis](http://www.redis.io/)
 * [MongoDB](http://www.mongodb.org)

## Directions
### Running the application for the first time
1. [Install mongodb](#mongodb), configure connection parameters in settings.js, and start it.
2. [Install redis](#redis) and start it with the provided redis.conf(change your password and anything else you'd like).
3. npm preinstall
4. npm install
5. npm start or npm test

### Controlling the application
Start, stop, and restart the application as a long running process, respectively:

    npm start
    npm stop

Start the server as a short running process

    npm test

## Preinstallation
### Dependency versions
I am using rvm and nvm for local development to manage ruby and node versions. Get them with these commands:

    \curl -sSL https://get.rvm.io | bash -s stable
    rvm install 2.10
    curl https://raw.github.com/creationix/nvm/master/install.sh | sh
    nvm install 0.10.24

Get sass, compass, and bootstrap:
    gem install sass --version 3.2.13
    gem install compass --version 0.12.2
    gem install bootstrap-sass --version 3.1.0.0


###Mongoose package
You may need to install the nodejs mongoose package prior to running npm install.

    npm install mongoose
    npm install
    
###MongoDB
You'll need to have a copy of mongodb running your database. For local development I use [mongoctl](http://github.com/mongolab/mongoctl) to provision mongo servers. You'll need to install python2, pip, and build tools to use this workflow. Pick one of the follow based on your OS/distro:

    sudo apt-get install python build-essential python-pip
    sudo pacman -S base-devel python2 python2-pip
    sudo yum install python python-pip build-essential ??? (requires testing)
    brew install ?something? (requires testing)

Then:

    sudo pip install mongoctl
    save the provided files in .mongoctl into ~/.mongoctl
    mongoctl install-mongodb 2.2.3
    mongoctl start cards
    mongoctl stop cards
    etc.

###Redis
We're using v2.6.12(but the version probably doesn't matter). For development purposes it isn't daemonized, while in production it should be. To run do as follows:

    redis-server redis.conf

To access the store:

    redis-cli -a SHittYpAssWORd

To [control](http://redis.io/commands) redis, once logged-in:

    keys *
    get #{KEY}
    flushdb
    shutdown
    etc.

##Configuration
###Compass
From the project root directory run the following listener command to set a watcher to compile sass to css:

    compass watch -c scss/config.rb

## Misc Credits
Card sprite provided by [Brandon Ardiente](http://ardisoft.net/svg-z-cards/) under the LGPL.  
Followed the tutorials by [Eric Rowell](http://www.html5canvastutorials.com/kineticjs/html5-canvas-events-tutorials-introduction-with-kineticjs/).  
[Sticky footer](http://twitter.github.io/bootstrap/examples/sticky-footer.html) by Marty Bean and Ryan Fait.

## License
Copyright (c) 2013, Ryan Johnston, L Gabriel Miller
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
