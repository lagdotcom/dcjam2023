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
- `debug(any)` prints to console
- `makePartyFace(dir: number)`
- `message(string)` adds in-game message
- `movePartyToTag(tag: string)` teleports party
- `onTagEnter(tag: string, function)` sets up an enter trigger callback
- `random(max: number): number` generates a random integer below `max`
- `tileHasTag(x: number, y: number, tag: string): bool`
