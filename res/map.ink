CONST dGate = 4
CONST dOpenGate = 5
CONST dLever = 6
CONST dPulledLever = 7
CONST dLockedDoor = 8

EXTERNAL active()
EXTERNAL damagePC(index, stat, amount)
EXTERNAL facing()
EXTERNAL getNumber(name)
EXTERNAL getString(name)
EXTERNAL getTagPosition(tag)
EXTERNAL giveItem(name)
EXTERNAL here()
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

=== show_message ===
# interact: ShowMessageOnInteract
    {getString("message")} -> DONE

=== show_sign ===
# interact: Sign
    {facing() == getNumber("messageDir"): {getString("message")}} -> DONE

=== treasure ===
# interact: Treasure
    ~ temp item = getString("item")
    ~ removeTag(here(), "Treasure")
    ~ removeObject(here())
    ~ giveItem(item)
    The box contains a {item}. -> DONE

=== function double_sided(pos, dir, -> fn) ===
    ~ fn(pos, dir)
    ~ fn(move(pos, dir), rotate(dir, 2))

=== function open_gate(pos, dir) ===
    ~ setDecal(pos, dir, dOpenGate)
    ~ setSolid(pos, dir, false)

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
