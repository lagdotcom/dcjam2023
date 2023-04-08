# DScript Design

## Types

- `number`, can be float or int doesn't matter we're using js after all
- `string` delimited with " (or '?) in code
- `bool` can be `true` or `false`, comparison operators produce these
- `function` matches a native (JS) function or a defined (DScript) one

## Expressions

All the boring normal stuff:

- `+ - * / ^` for arithmetic
- `and or` for short-circuiting boolean logic
- `xor` for boolean logic
- `== != > >= < <=` for comparison
- unary `-` for negation
- unary `not` for boolean negation

## Statements

- `function name(args)[: type] ... end` defines a function in the current scope
- `if expr then ... [else ...] end` gives you selection
- `return [expr]` to return values from a function
- `name = expr` for declaration/assignment, `=` can be `+=`, `-=` etc.

## Builtins

- `NORTH`/`EAST`/`SOUTH`/`WEST` symbolic constants for directions
- `partyX`/`partyY`/`partyDir` constants for party position/facing
- `selectedX`/`selectedY` set after `selectTileWithTag`
- `pcIndex` the interacting PC (facing / skill use)
- `addArenaEnemy(name)` now follows party
- `addNormalEnemy(name)` preparation for calling `startNormalFight`
- `addTag(x: number, y: number, tag: string)`
- `clearObstacle()` undoes affect of `obstacle()`
- `damagePC(number, stat, amount)`
- `debug(any)` prints to console
- `getNumber(key: string): number` get cell #NUMBER by key
- `getPCName(number): string`
- `getString(key: string): string` get cell #STRING by key
- `giveItem(name)`
- `isArenaFightPending(): bool`
- `isSolid(x: number, y: number, dir): bool` checks if the wall is solid
- `makePartyFace(dir: number)`
- `message(string)` adds in-game message
- `movePartyToTag(tag: string)` teleports party
- `obstacle()` prevents party from moving out of this square other than how they entered
- `onTagEnter(tag: string, function)` sets up an enter trigger callback
  - the callback should be like `function callback(x: number, y: number)`
- `onTagInteract(tag: string, function)` sets up an interact callback
  - the callback should be like `function callback(skill: string)`
- `playSound(name)`
- `random(max: number): number` generates a random integer below `max`
- `removeObject(x: number, y: number)`
- `removeTag(x: number, y: number, tag: string)`
- `selectTileWithTag(tag: string)` sets `selectedX/Y`
- `setDecal(x: number, y: number, dir, decal)`
- `setSolid(x: number, y: number, dir, solid: bool)`
- `skillCheck(stat, difficulty): bool` makes the active PC roll a d10 skill check
- `startArenaFight(): bool` returns false if there's no enemies waiting
- `startNormalFight(): bool` returns false if there's no enemies waiting
- `tileHasTag(x: number, y: number, tag: string): bool`
- `unlock(x: number, y: number, dir)` makes a wall not solid
