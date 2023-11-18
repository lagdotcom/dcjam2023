INCLUDE daggers.ink

VAR next_fight = -> first_fight

=== enter_arena ===
# enter: Arena
    -> next_fight

=== reset ===
    ~ teleportParty(getTagPosition("Start"), NORTH)
    -> DONE

=== first_fight ===
    ~ addArenaEnemy("Eve Scout")
    ~ startArenaFight("first_fight_after")
    -> DONE
=== first_fight_after ===
    ~ next_fight = -> second_fight
    gratz lol -> reset

=== second_fight ===
    ~ addArenaEnemy("Eve Scout")
    ~ startArenaFight("second_fight_after")
    -> DONE
=== second_fight_after ===
    ~ next_fight = -> done_with_fights
    you did et -> reset

=== done_with_fights ===
    Look, you did it. Sod off. -> DONE
