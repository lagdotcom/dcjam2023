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
EXTERNAL startArenaFight()

=== show_message ===
# interact: ShowMessageOnInteract
    {getString("message")} -> DONE

=== show_sign ===
# interact: Sign
    {facing() == getNumber("messageDir"): {getString("message")}} -> DONE

=== loam_seer_sign ===
# interact: LoamSeerSign
    {facing() == getNumber("messageDir"):
        {skill() != "Shift":
            {name(active())} can't decipher it. -> DONE
        }

        {skillCheck("spirit", getNumber("difficulty")):
            ~ removeTag(here(), "LoamSeerSign")
            ~ addTag(here(), "Sign")
            {name(active())} deciphers the message. -> show_sign
          - else:
            {name(active())} becomes morose after being unable to decipher it.
            ~ damagePC(active(), "spirit", 1)
        }
    } -> DONE

=== treasure ===
# once
# interact: Treasure
    ~ temp item = getString("item")
    ~ removeObject(here())
    ~ giveItem(item)
    The box contains a {item}. -> DONE

=== empty_chest ===
# once
# interact: EmptyChest
    ~ removeObject(here())
    The sight of the empty chest causes {name(active())} to lose heart.
    ~ damagePC(active(), "camaraderie", 1)
    -> DONE

=== function double_sided(pos, dir, -> fn) ===
    ~ fn(pos, dir)
    ~ fn(move(pos, dir), rotate(dir, 2))

=== function open_gate(pos, dir) ===
    ~ setDecal(pos, dir, dOpenGate)
    ~ setSolid(pos, dir, false)

=== function close_gate(pos, dir) ===
    ~ setDecal(pos, dir, dGate)
    ~ setSolid(pos, dir, true)

=== use_gate_lever ===
# interact: GateLever
    {facing() != getNumber("leverDir"): -> DONE}
    ~ removeTag(here(), "GateLever")
    ~ setDecal(here(), facing(), dPulledLever)
    ~ double_sided(getTagPosition(getString("gateTag")), getNumber("gateDir"), -> open_gate)
    -> show_message

=== function clear_obstacle(tag) ===
    ~ setObstacle(false)
    ~ removeObject(here())
    ~ removeTag(here(), tag)
    ~ playSound("woosh")

=== web_enter ===
# enter: Web
    ~ setObstacle(true)
    A huge web blocks your path. -> DONE

=== web_interact ===
# interact: Web
    ~ temp n = name(active())
    { skill():
        - "Cut":
            {skillCheck("determination", 4):
                ~ clear_obstacle("Web")
                {n} cuts the webs away. -> DONE
            }
        - "Smash":
            {skillCheck("determination", 6):
                ~ clear_obstacle("Web")
                {n} smashes into the webs. -> DONE
            }
        - "Shift":
            {skillCheck("determination", 4):
                ~ clear_obstacle("Web")
                {n} shifts through the webs. -> DONE
            }                
        - else:
            {n} does not understand how to deal with this. -> DONE
    }
    {n} strains themselves trying to deal with the web.
    ~ damagePC(active(), "spirit", 1)
    -> DONE
=== boulder_enter ===
# enter: Boulder
    ~ setObstacle(true)
    A large boulder blocks your path. -> DONE

=== boulder_interact ===
# interact: Boulder
    ~ temp n = name(active())
    { skill():
        - "Smash":
            {skillCheck("determination", 4):
                ~ clear_obstacle("Boulder")
                {n} smashes the boulder to bits. -> DONE
            }
        - "Shift":
            {skillCheck("determination", 6):
                ~ clear_obstacle("Boulder")
                {n} shifts the boulder away. -> DONE
            }
        - else:
            {n} does not understand how to deal with this. -> DONE
    }
    {n} strains themselves trying to deal with the boulder.
    ~ damagePC(active(), "spirit", 1)
    -> DONE

=== maybe_scout ===
# once
# enter: ScoutEncounter1
    ~ removeObject(here())
    The eve scout sizes you up and looks to dart into the shadows.
    { skillCheck("determination", 12):
        Before the eve scout can move a muscle, they are struck down by {name(active())}.
      - else:
        You were unable to react in time; the eve scout slips into the darkness.
        ~ addArenaEnemy("Eve Scout")
    } -> DONE

=== martialist_and_sage ===
# once
# enter: MixedEncounter2
    ~ removeObject(here())
    ~ addArenaEnemy("Mullanginan Martialist")
    ~ addArenaEnemy("Nettle Sage")
    Two martialists and a Nettle Sage block the doorway in the distance, before you have a chance to react they've disappeared.
    The faint echo of Mullanginan's laughter reverberates through the tunnels. -> DONE

=== sage ===
# once
# enter: SageEncounter3
    ~ addArenaEnemy("Nettle Sage")
    A nettle sage flits off down the hall as you approach. -> DONE

=== uncaring_martialist ===
# enter: MartialistEncounter4
    A martialist is propped against the wall, he seems to not care about your intrusion. -> DONE

=== sneed1 ===
# once
# enter: SneedEncounter5
    ~ removeObject(here())
    ~ addArenaEnemy("Sneed Crawler")
    The busy Sneed Crawler takes notice of you, bleeping loudly before burrowing away. -> DONE

=== martialist2 ===
# once
# enter: MartialistEncounter6
    ~ removeObject(here())
    ~ addArenaEnemy("Mullanginan Martialist")
    ~ addArenaEnemy("Mullanginan Martialist")
    Martialists overseeing tunnel construction meet your eye, then slip into shadow. -> DONE

=== sneed2 ===
# once
# enter: SneedEncounter7
    ~ removeObject(here())
    ~ addArenaEnemy("Sneed Crawler")
    ~ addArenaEnemy("Sneed Crawler")
    A duo of sneed crawlers are merrily digging through the tunnels, screeching past with reckless abandon. -> DONE

=== scout_and_sage ===
# once
# enter: MixedEncounter8
    ~ removeObject(here())
    ~ addArenaEnemy("Eve Scout")
    ~ addArenaEnemy("Nettle Sage")
    A set of eyes pass through the shadows, followed by the sound of rustling leaves. -> DONE

=== end_of_jam ===
# enter: JamEncounter9
    The night of the poisoned daggers will continue... This is the end of our entry, thanks for playing, and let us know what you thought! -> DONE

=== function open_arena_gate(pos) ===
    { getDecal(pos, NORTH) == dGate:
        ~ double_sided(pos, NORTH, -> open_gate)
    }
    { getDecal(pos, EAST) == dGate:
        ~ double_sided(pos, EAST, -> open_gate)
    }
    { getDecal(pos, SOUTH) == dGate:
        ~ double_sided(pos, SOUTH, -> open_gate)
    }
    { getDecal(pos, WEST) == dGate:
        ~ double_sided(pos, WEST, -> open_gate)
    }

=== function close_arena_gate(pos) ===
    { getDecal(pos, NORTH) == dOpenGate:
        ~ double_sided(pos, NORTH, -> close_gate)
    }
    { getDecal(pos, EAST) == dOpenGate:
        ~ double_sided(pos, EAST, -> close_gate)
    }
    { getDecal(pos, SOUTH) == dOpenGate:
        ~ double_sided(pos, SOUTH, -> close_gate)
    }
    { getDecal(pos, WEST) == dOpenGate:
        ~ double_sided(pos, WEST, -> close_gate)
    }

VAR arenaOpen = true
=== arena ===
# enter: Arena
    { arenaOpen == isArenaFightPending():
        ~ arenaOpen = not arenaOpen
        { arenaOpen:
            ~ forEachTaggedTile("ArenaGate", -> open_arena_gate)
            The gates slide open. The gods are sated.
          - else:
            ~ forEachTaggedTile("ArenaGate", -> close_arena_gate)
            ~ playSound("clank")
            The gate to the arena slams behind you, the gods cheer for blood!
        }
    } -> DONE

=== arena_fight ===
# enter: ArenaMiddle
    { isArenaFightPending():
        The forcs of Mullanginan rally around you!
        ~ startArenaFight()
      - else:
        This is a safe haven... for now.
    } -> DONE
