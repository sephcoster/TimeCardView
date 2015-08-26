# TimeCardView

A web front-end to the Kronos API.

## Technologies Used

* React
* Gulp 
* Webpack
* Babel
* Flux (flummox)
* BrowserSync
* npm
* bower
* lodash

## Screen Shots

<img width="1392" alt="screen shot 2015-08-25 at 5 27 10 pm" src="https://cloud.githubusercontent.com/assets/5105665/9483024/a3f8677a-4b4f-11e5-804e-342d7523560b.png">
<img width="1392" alt="screen shot 2015-08-25 at 5 27 19 pm" src="https://cloud.githubusercontent.com/assets/5105665/9483026/a3fa6b60-4b4f-11e5-9b44-fc1aecd8d52b.png">
<img width="1392" alt="screen shot 2015-08-25 at 5 27 23 pm" src="https://cloud.githubusercontent.com/assets/5105665/9483023/a3f63a4a-4b4f-11e5-9cd0-996246348f3c.png">
<img width="1392" alt="screen shot 2015-08-25 at 5 27 38 pm" src="https://cloud.githubusercontent.com/assets/5105665/9483025/a3f9246c-4b4f-11e5-8951-f8e4d336c97c.png">


## Development

### Setting up development environment

##### Windows

Download: 
  - nodeJS v0.10.9 (http://nodejs.org/dist/v0.10.9/node-v0.10.9-x86.msi)
  - python (https://www.python.org/downloads/release/python-279/)
  - ruby (http://rubyinstaller.org/)

Set up path:

You will need to add all the things we just downloaded to you path. This will allow you to use Git, node, python, etc. in your command line. Open a powershell and enter the following command (filling in with correct locations)

    [Environment]::SetEnvironmentVariable("Path", "$env:Path;C:\NodeJS;C:\GIT\BIN\;C:\GIT\CMD\;C:\RUBY\;C:\PYTHON", "User")

Mine, for example, looked like this:

    [Environment]::SetEnvironmentVariable("Path", "$env:Path;C:\Program Files (x86)\nodejs\;C:\Users\Che\AppData\Local\GitHub\PortableGit_c2ba306e536fdf878271f7fe636a147ff37326ad\bin\;C:\Users\Che\AppData\Local\GitHub\PortableGit_c2ba306e536fdf878271f7fe636a147ff37326ad\cmd\;C:\Ruby22\bin\;C:\Python27\", "User")
    
You can also do this via the GUI:  http://www.computerhope.com/issues/ch000549.htm

Restart to make the changes take effect. Once you restart, you should see the changes by running in the cmd line

    echo %PATH% 

Update NPM

The npm packaged with the version of Node we downloaded is not the version we want. Open the command line as an administrator (right-click > run as admin), cd to C:\Program Files (x86)\nodejs [this might be different if you aren't on a 64-bit system]. Do

    npm install npm@2.1.5
    
Continue with install.

*If at any point the npm install fails, you should completely delete the node modules folder, fix the issue, then run npm install again.

#### Get the source code  

    git clone git@github.com:TeamACapstone2015/TimeCardView.git
    cd TimeCardView

#### Install NPM

NPM sometimes referred to as The Node Package Manager is responsible
for downloading the dependencies for this project. Its installation
will depend on what environment you are using.

NPM will can install things 3 different ways. Its will install things
into the `./node_modules` directory by default, under `~/` if the
`--user` flag is given or under `/` if the `--global` flag is using.
Note, root permissions may be required if the `--global` flag is used.

##### Ubuntu/Debian

    sudo apt-get update && sudo apt-get install npm

##### Mac

    brew install npm 

#### Install Bower

Bower is the second package manager used in this project. It is very
similar to NPM but install packages in a way the browser understands.
Bower will install the dependencies under the `app/bower_components/`
directory. `sudo` or evelvated permission may be needed on some systems.

    npm install --global bower

#### Install Gulp
    
Gulp is the build system for this project. It is responsible for 
compiling JSX and Sass as well as constructing the test and production 
builds. http://gulpjs.com/. `sudo` or evelvated permission may be needed 
on some systems.

    npm install --global gulp

#### Install Sass

Sass is an alternative to CSS. Gulp will compile any Sass in to CSS at
build time.  `sudo` or evelvated permission may be needed on some systems.

    gem install sass

#### Install npm/bower dependencies

In root directory of project the following command will install of the
NPM dependencies under the `./node_modules/` directory  and bower 
dependencies under the `./app/bower_components/` directory.

    npm install
    

### Automatic build for development

Run this command when developing. Gulp will watch for any changes and
automatically rebuild and open in a browser.

    gulp watch

For windows:

    .\node_modules\.bin\gulp watch

### Running the test suite

Command to run the test suite.

    npm test

### build for development

    npm run watch

### build for deployment

Command to build for production. 

    npm run build
	
### Running express server

Command to run express server.

    npm start
