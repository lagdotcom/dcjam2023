CONST NORTH = 0
CONST EAST = 1
CONST SOUTH = 2
CONST WEST = 3

CONST dGate = 4
CONST dOpenGate = 5
CONST dLever = 6
CONST dPulledLever = 7
CONST dLockedDoor = 8

EXTERNAL active()
EXTERNAL addArenaEnemy(name)
EXTERNAL addTag(pos, tag)
EXTERNAL damagePC(index, stat, amount)
EXTERNAL facing()
EXTERNAL forEachTaggedTile(tag, callback)
EXTERNAL getDecal(pos, side)
EXTERNAL getNumber(name)
EXTERNAL getString(name)
EXTERNAL getTagPosition(tag)
EXTERNAL giveItem(name)
EXTERNAL here()
EXTERNAL isArenaFightPending()
EXTERNAL move(pos, dir)
EXTERNAL name(index)
EXTERNAL playSound(name)
EXTERNAL removeObject(pos)
EXTERNAL removeTag(pos, tag)
EXTERNAL rotate(dir, clockwise)
EXTERNAL setDecal(pos, dir, decal)
EXTERNAL setObstacle(blocked)
EXTERNAL setSolid(pos, dir, bool)
EXTERNAL skill()
EXTERNAL skillCheck(stat, difficulty)
EXTERNAL startArenaFight(knot)
EXTERNAL teleportParty(pos, dir)
