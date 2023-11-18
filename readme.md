# Poisoned Daggers

Sad Folks Interactive's entry for Dungeon Crawler Jam 2023!

## Setup

Assuming you're starting from literally nothing, here's the steps to getting it working.

### Get the Code

There's a few options for this:

- Install [Git for Windows](https://gitforwindows.org) and use `git clone https://github.com/lagdotcom/dcjam2023.git`. To update, go into that directory and type `git pull`.
- Install [GitHub CLI](https://cli.github.com) and use `gh repo clone lagdotcom/dcjam2023`. To update, same as above.
- Use the `<> Code` link above to download the code directly and put it somewhere. To update, you just download it again.

### Node

First you need `node`, a javascript engine. The easiest way to manage this is using [nvm](https://github.com/coreybutler/nvm-windows). Grab the binary and install it, then in a console run `nvm install 16.10`. Check it worked by running `node --version`.

### Yarn

Now you need `yarn`, a package management tool. Just run `corepack enable` and it should download it; check it worked with `yarn --version`. Now navigate to your dcjam2023 directory and type `yarn`. This will install the dependencies for this project.

### Development

Run `yarn watch`. This will start a local webserver at http://localhost:8080. Feel free to edit the code, resources etc. and refresh to see the newest version.

## Maps

The engine supports maps exported from Grid Cartographer to a JSON format. To enable Poisoned Daggers features you add Notes to cells. Lines that do not begin with `#` are ignored. The following Notes should be placed to the top left of any other cells in the level so they get loaded first:

| Tag                              | Meaning                                                        |
| -------------------------------- | -------------------------------------------------------------- |
| `#ATLAS file,file,...`           | Loads image atlases                                            |
| `#DEFINE name,value`             | Defines a constant that can be used anywhere else in map Notes |
| `#STYLE index,textureId`         | Associates the given colour index with a texture id            |
| `#DECAL decal,textureId,decalId` | Associates a decal type+texture id combo with a decal id       |
| `#SCRIPT file,file,...`          | Loads script files                                             |

These Notes affect the cell they are placed in. Markers are ignored.

| Tag                    | Meaning                                      |
| ---------------------- | -------------------------------------------- |
| `#START dir`           | Party will be placed here when map is loaded |
| `#TAG tag,tag,...`     | Places tags that can be read by scripts      |
| `#OBJECT id`           | Places an object (graphic) here              |
| `#STRING name,"value"` | Sets a string attribute                      |
| `#NUMBER name,value`   | Sets a number attribute                      |
| `#OPEN`                | All gates connected to this cell begin open  |

## Scripts

Map scripts are written in [Ink](https://www.inklestudios.com/ink/). You can make knots callable by the engine by annotating them with one of the following tags:

- `# enter: tag`: will be called when the party enters a cell with the specified tag.
- `# interact: tag`: will be called when the party uses an interaction in a cell with the specified tag. You will probably want to check `facing()` and maybe `skill()`.

You can also add `# once` to make the knot only execute once. This is implemented by _removing the triggering tag from the cell_.

By using `INCLUDE daggers.ink` you get access to a number of builtin functions:

| Function                     | Meaning                                    |
| ---------------------------- | ------------------------------------------ |
| `active()`                   | get active PC ID                           |
| `addArenaEnemy(name)`        | queue enemy for next arena fight           |
| `addTag(xy,tag)`             | add a tag to a cell                        |
| `damagePC(pcId,stat,amount)` | damage a PC                                |
| `facing()`                   | get party facing dir                       |
| `forEachTaggedTile(tag,fn)`  | fn is called with each tagged cell's xy    |
| `getDecal(xy,dir)`           | get decal ID on cell wall                  |
| `getNumber(name)`            | get `#NUMBER name` from map                |
| `getString(name)`            | get `#STRING name` from map                |
| `getTagPosition(tag)`        | finds the first cell's xy with this tag    |
| `giveItem(item)`             | adds item to party inventory               |
| `here()`                     | get party xy                               |
| `isArenaFightPending()`      | does arena queue have at least one enemy   |
| `move(xy,dir)`               | returns xy after moving in direction       |
| `name(dir)`                  | get PC name                                |
| `playSound(name)`            | play a sound effect                        |
| `removeObject(xy)`           | remove object in cell                      |
| `removeTag(xy,tag)`          | remove tag from cell                       |
| `rotate(dir,n)`              | returns dir after n clockwise rotations    |
| `setDecal(xy,dir,decal)`     | set decal in cell                          |
| `setObstacle(flag)`          | if true, prevents moving through this cell |
| `setSolid(xy,dir,flag)`      | set cell wall solidity                     |
| `skill()`                    | get name of active PC skill                |
| `skillCheck(stat,dc)`        | roll active PC stat against DC             |
| `startArenaFight()`          | puts arena queue into fight, clears queue  |
