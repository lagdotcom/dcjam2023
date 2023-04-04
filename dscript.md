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
- `pcIndex` the PC who did something recently, some calls set it
- `addEnemy(name)` now follows party
- `damagePC(number, stat, amount)`
- `debug(any)` prints to console
- `getPCName(number): string`
- `isSolid(x: number, y: number, dir): bool` checks if the wall is solid
- `makePartyFace(dir: number)`
- `message(string)` adds in-game message
- `movePartyToTag(tag: string)` teleports party
- `onTagEnter(tag: string, function)` sets up an enter trigger callback
- `onTagInteract(tag: string, function)` sets up an interact callback
- `random(max: number): number` generates a random integer below `max`
- `removeTag(x: number, y:number, tag: string)`
- `skillCheck(stat, difficulty): bool` makes a PC roll a d10 skill check, also sets `pcIndex`
- `startArenaFight(): bool` returns false if there's no enemies waiting
- `tileHasTag(x: number, y: number, tag: string): bool`
- `unlock(x: number, y: number, dir)` makes a wall not solid
