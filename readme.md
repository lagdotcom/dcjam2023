# Poisoned Daggers

Sad Folks Interactive's entry for Dungeon Crawler Jam 2023!

## Setup

Assuming you're starting from literally nothing, here's the steps to getting it working.

### Get the Code

There's a few options for this:

- Install `Git for Windows` and use `git clone https://github.com/lagdotcom/dcjam2023.git`. To update, go into that directory and type `git pull`.
- Install [GitHub CLI](https://cli.github.com) and use `gh repo clone lagdotcom/dcjam2023`. To update, same as above.
- Use the `<> Code` link above to download the code directly and put it somewhere. To update, you just download it again.

### Node

First you need `node`, a javascript engine. The easiest way to manage this is using [nvm](https://github.com/coreybutler/nvm-windows). Grab the binary and install it, then in a console run `nvm install 16.10`. Check it worked by running `node --version`.

### Yarn

Now you need `yarn`, a package management tool. Just run `corepack enable` and it should download it; check it worked with `yarn --version`. Now navigate to your dcjam2023 directory and type `yarn`. This will install the dependencies for this project.

### Development

Run `yarn watch`. This will start a local webserver at http://localhost:8080. Feel free to edit the code, resources etc. and refresh to see the newest version.
