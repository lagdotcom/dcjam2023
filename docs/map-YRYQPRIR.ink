{"inkVersion":21,"root":[["\n",["done",{"#n":"g-0"}],null],"done",{"show_message":["#","^interact: ShowMessageOnInteract","/#","ev","str","^message","/str",{"x()":"getString","exArgs":1},"out","/ev","^ ","done","\n",null],"show_sign":["#","^interact: Sign","/#","ev",{"x()":"facing"},"str","^messageDir","/str",{"x()":"getNumber","exArgs":1},"==","/ev",[{"->":".^.b","c":true},{"b":["^ ","ev","str","^message","/str",{"x()":"getString","exArgs":1},"out","/ev",{"->":".^.^.^.12"},null]}],"nop","^ ","done","\n",null],"loam_seer_sign":["#","^interact: LoamSeerSign","/#","ev",{"x()":"facing"},"str","^messageDir","/str",{"x()":"getNumber","exArgs":1},"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"x()":"skill"},"str","^Shift","/str","!=","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"x()":"active"},{"x()":"name","exArgs":1},"out","/ev","^ can't decipher it. ","done","\n",{"->":".^.^.^.9"},null]}],"nop","\n","ev","str","^spirit","/str","str","^difficulty","/str",{"x()":"getNumber","exArgs":1},{"x()":"skillCheck","exArgs":2},"/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"x()":"here"},"str","^LoamSeerSign","/str",{"x()":"removeTag","exArgs":2},"pop","/ev","\n","ev",{"x()":"here"},"str","^Sign","/str",{"x()":"addTag","exArgs":2},"pop","/ev","\n","ev",{"x()":"active"},{"x()":"name","exArgs":1},"out","/ev","^ deciphers the message. ",{"->":"show_sign"},"\n",{"->":".^.^.^.23"},null]}],[{"->":".^.b"},{"b":["\n","ev",{"x()":"active"},{"x()":"name","exArgs":1},"out","/ev","^ becomes morose after being unable to decipher it.","\n","ev",{"x()":"active"},"str","^spirit","/str",1,{"x()":"damagePC","exArgs":3},"pop","/ev","\n",{"->":".^.^.^.23"},null]}],"nop","\n",{"->":".^.^.^.12"},null]}],"nop","^ ","done","\n",null],"treasure":[["#","^interact: Treasure","/#","^Before you is a treasure chest.","\n","ev","str","^Open it","/str","/ev",{"*":".^.c-0","flg":4},"ev","str","^Leave it alone","/str","/ev",{"*":".^.c-1","flg":4},{"c-0":["\n","ev","str","^item","/str",{"x()":"getString","exArgs":1},"/ev",{"temp=":"item"},"\n","ev",{"x()":"here"},"str","^Treasure","/str",{"x()":"removeTag","exArgs":2},"pop","/ev","\n","ev",{"VAR?":"item"},{"x()":"giveItem","exArgs":1},"pop","/ev","\n","^The chest contains a ","ev",{"VAR?":"item"},"out","/ev","^. ","done","\n",null],"c-1":["^ ","done","\n",null]}],null],"empty_chest":[["#","^interact: EmptyChest","/#","^Before you is a treasure chest.","\n","ev","str","^Open it","/str","/ev",{"*":".^.c-0","flg":4},"ev","str","^Leave it alone","/str","/ev",{"*":".^.c-1","flg":4},{"c-0":["\n","ev",{"x()":"here"},"str","^EmptyChest","/str",{"x()":"removeTag","exArgs":2},"pop","/ev","\n","ev",{"x()":"active"},"str","^camaraderie","/str",1,{"x()":"damagePC","exArgs":3},"pop","/ev","\n","^The sight of the empty chest causes ","ev",{"x()":"active"},{"x()":"name","exArgs":1},"out","/ev","^ to lose heart. ","done","\n",null],"c-1":["^ ","done","\n",null]}],null],"double_sided":[{"temp=":"fn"},{"temp=":"dir"},{"temp=":"pos"},"ev",{"VAR?":"pos"},{"VAR?":"dir"},{"f()":"fn","var":true},"pop","/ev","\n","ev",{"VAR?":"pos"},{"VAR?":"dir"},{"x()":"move","exArgs":2},{"VAR?":"dir"},2,{"x()":"rotate","exArgs":2},{"f()":"fn","var":true},"pop","/ev","\n",null],"open_gate":[{"temp=":"dir"},{"temp=":"pos"},"ev",{"VAR?":"pos"},{"VAR?":"dir"},5,{"x()":"setDecal","exArgs":3},"pop","/ev","\n","ev",{"VAR?":"pos"},{"VAR?":"dir"},false,{"x()":"setSolid","exArgs":3},"pop","/ev","\n",{"#f":3}],"close_gate":[{"temp=":"dir"},{"temp=":"pos"},"ev",{"VAR?":"pos"},{"VAR?":"dir"},4,{"x()":"setDecal","exArgs":3},"pop","/ev","\n","ev",{"VAR?":"pos"},{"VAR?":"dir"},true,{"x()":"setSolid","exArgs":3},"pop","/ev","\n",{"#f":3}],"use_gate_lever":["#","^interact: GateLever","/#","ev",{"x()":"facing"},"str","^leverDir","/str",{"x()":"getNumber","exArgs":1},"!=","/ev",[{"->":".^.b","c":true},{"b":["^ ","done",{"->":".^.^.^.12"},null]}],"nop","\n","ev",{"x()":"here"},"str","^GateLever","/str",{"x()":"removeTag","exArgs":2},"pop","/ev","\n","ev",{"x()":"here"},{"x()":"facing"},7,{"x()":"setDecal","exArgs":3},"pop","/ev","\n","ev","str","^gateTag","/str",{"x()":"getString","exArgs":1},{"x()":"getTagPosition","exArgs":1},"str","^gateDir","/str",{"x()":"getNumber","exArgs":1},{"^->":"open_gate"},{"f()":"double_sided"},"pop","/ev","\n",{"->":"show_message"},null],"clear_obstacle":[{"temp=":"tag"},"ev",false,{"x()":"setObstacle","exArgs":1},"pop","/ev","\n","ev",{"x()":"here"},{"x()":"removeObject","exArgs":1},"pop","/ev","\n","ev",{"x()":"here"},{"VAR?":"tag"},{"x()":"removeTag","exArgs":2},"pop","/ev","\n","ev","str","^woosh","/str",{"x()":"playSound","exArgs":1},"pop","/ev","\n",null],"web_enter":["#","^enter: Web","/#","ev",true,{"x()":"setObstacle","exArgs":1},"pop","/ev","\n","^A huge web blocks your path. ","done","\n",null],"web_interact":["#","^interact: Web","/#","ev",{"x()":"active"},{"x()":"name","exArgs":1},"/ev",{"temp=":"n"},"\n","ev",{"x()":"skill"},"/ev",["du","ev","str","^Cut","/str","==","/ev",{"->":".^.b","c":true},{"b":["pop","\n","ev","str","^determination","/str",4,{"x()":"skillCheck","exArgs":2},"/ev",[{"->":".^.b","c":true},{"b":["\n","ev","str","^Web","/str",{"f()":"clear_obstacle"},"pop","/ev","\n","ev",{"VAR?":"n"},"out","/ev","^ cuts the webs away. ","done","\n",{"->":".^.^.^.10"},null]}],"nop","\n",{"->":".^.^.^.16"},null]}],["du","ev","str","^Smash","/str","==","/ev",{"->":".^.b","c":true},{"b":["pop","\n","ev","str","^determination","/str",6,{"x()":"skillCheck","exArgs":2},"/ev",[{"->":".^.b","c":true},{"b":["\n","ev","str","^Web","/str",{"f()":"clear_obstacle"},"pop","/ev","\n","ev",{"VAR?":"n"},"out","/ev","^ smashes into the webs. ","done","\n",{"->":".^.^.^.10"},null]}],"nop","\n",{"->":".^.^.^.16"},null]}],["du","ev","str","^Shift","/str","==","/ev",{"->":".^.b","c":true},{"b":["pop","\n","ev","str","^determination","/str",4,{"x()":"skillCheck","exArgs":2},"/ev",[{"->":".^.b","c":true},{"b":["\n","ev","str","^Web","/str",{"f()":"clear_obstacle"},"pop","/ev","\n","ev",{"VAR?":"n"},"out","/ev","^ shifts through the webs. ","done","\n",{"->":".^.^.^.10"},null]}],"nop","\n",{"->":".^.^.^.16"},null]}],[{"->":".^.b"},{"b":["pop","\n","ev",{"VAR?":"n"},"out","/ev","^ does not understand how to deal with this. ","done","\n",{"->":".^.^.^.16"},null]}],"nop","\n","ev",{"VAR?":"n"},"out","/ev","^ strains themselves trying to deal with the web.","\n","ev",{"x()":"active"},"str","^spirit","/str",1,{"x()":"damagePC","exArgs":3},"pop","/ev","\n","done",null],"boulder_enter":["#","^enter: Boulder","/#","ev",true,{"x()":"setObstacle","exArgs":1},"pop","/ev","\n","^A large boulder blocks your path. ","done","\n",null],"boulder_interact":["#","^interact: Boulder","/#","ev",{"x()":"active"},{"x()":"name","exArgs":1},"/ev",{"temp=":"n"},"\n","ev",{"x()":"skill"},"/ev",["du","ev","str","^Smash","/str","==","/ev",{"->":".^.b","c":true},{"b":["pop","\n","ev","str","^determination","/str",4,{"x()":"skillCheck","exArgs":2},"/ev",[{"->":".^.b","c":true},{"b":["\n","ev","str","^Boulder","/str",{"f()":"clear_obstacle"},"pop","/ev","\n","ev",{"VAR?":"n"},"out","/ev","^ smashes the boulder to bits. ","done","\n",{"->":".^.^.^.10"},null]}],"nop","\n",{"->":".^.^.^.15"},null]}],["du","ev","str","^Shift","/str","==","/ev",{"->":".^.b","c":true},{"b":["pop","\n","ev","str","^determination","/str",6,{"x()":"skillCheck","exArgs":2},"/ev",[{"->":".^.b","c":true},{"b":["\n","ev","str","^Boulder","/str",{"f()":"clear_obstacle"},"pop","/ev","\n","ev",{"VAR?":"n"},"out","/ev","^ shifts the boulder away. ","done","\n",{"->":".^.^.^.10"},null]}],"nop","\n",{"->":".^.^.^.15"},null]}],[{"->":".^.b"},{"b":["pop","\n","ev",{"VAR?":"n"},"out","/ev","^ does not understand how to deal with this. ","done","\n",{"->":".^.^.^.15"},null]}],"nop","\n","ev",{"VAR?":"n"},"out","/ev","^ strains themselves trying to deal with the boulder.","\n","ev",{"x()":"active"},"str","^spirit","/str",1,{"x()":"damagePC","exArgs":3},"pop","/ev","\n","done",null],"maybe_scout":["#","^once","/#","#","^enter: ScoutEncounter1","/#","ev",{"x()":"here"},{"x()":"removeObject","exArgs":1},"pop","/ev","\n","^The eve scout sizes you up and looks to dart into the shadows.","\n","ev","str","^determination","/str",12,{"x()":"skillCheck","exArgs":2},"/ev",[{"->":".^.b","c":true},{"b":["\n","^Before the eve scout can move a muscle, they are struck down by ","ev",{"x()":"active"},{"x()":"name","exArgs":1},"out","/ev","^.","\n",{"->":".^.^.^.23"},null]}],[{"->":".^.b"},{"b":["\n","^You were unable to react in time; the eve scout slips into the darkness.","\n","ev","str","^Eve Scout","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n",{"->":".^.^.^.23"},null]}],"nop","^ ","done","\n",null],"martialist_and_sage":["#","^once","/#","#","^enter: MixedEncounter2","/#","ev",{"x()":"here"},{"x()":"removeObject","exArgs":1},"pop","/ev","\n","ev","str","^Mullanginan Martialist","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","ev","str","^Nettle Sage","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","^Two martialists and a Nettle Sage block the doorway in the distance, before you have a chance to react they've disappeared.","\n","^The faint echo of Mullanginan's laughter reverberates through the tunnels. ","done","\n",null],"sage":["#","^once","/#","#","^enter: SageEncounter3","/#","ev",{"x()":"here"},{"x()":"removeObject","exArgs":1},"pop","/ev","\n","ev","str","^Nettle Sage","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","^A nettle sage flits off down the hall as you approach. ","done","\n",null],"uncaring_martialist":["#","^enter: MartialistEncounter4","/#","^A martialist is propped against the wall, he seems to not care about your intrusion. ","done","\n",null],"sneed1":["#","^once","/#","#","^enter: SneedEncounter5","/#","ev",{"x()":"here"},{"x()":"removeObject","exArgs":1},"pop","/ev","\n","ev","str","^Sneed Crawler","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","^The busy Sneed Crawler takes notice of you, bleeping loudly before burrowing away. ","done","\n",null],"martialist2":["#","^once","/#","#","^enter: MartialistEncounter6","/#","ev",{"x()":"here"},{"x()":"removeObject","exArgs":1},"pop","/ev","\n","ev","str","^Mullanginan Martialist","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","ev","str","^Mullanginan Martialist","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","^Martialists overseeing tunnel construction meet your eye, then slip into shadow. ","done","\n",null],"sneed2":["#","^once","/#","#","^enter: SneedEncounter7","/#","ev",{"x()":"here"},{"x()":"removeObject","exArgs":1},"pop","/ev","\n","ev","str","^Sneed Crawler","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","ev","str","^Sneed Crawler","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","^A duo of sneed crawlers are merrily digging through the tunnels, screeching past with reckless abandon. ","done","\n",null],"scout_and_sage":["#","^once","/#","#","^enter: MixedEncounter8","/#","ev",{"x()":"here"},{"x()":"removeObject","exArgs":1},"pop","/ev","\n","ev","str","^Eve Scout","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","ev","str","^Nettle Sage","/str",{"x()":"addArenaEnemy","exArgs":1},"pop","/ev","\n","^A set of eyes pass through the shadows, followed by the sound of rustling leaves. ","done","\n",null],"end_of_jam":["#","^enter: JamEncounter9","/#","^The night of the poisoned daggers will continue... This is the end of our entry, thanks for playing, and let us know what you thought! ","done","\n",null],"open_arena_gate":[{"temp=":"pos"},"ev",{"VAR?":"pos"},0,{"x()":"getDecal","exArgs":2},4,"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"VAR?":"pos"},0,{"^->":"open_gate"},{"f()":"double_sided"},"pop","/ev","\n",{"->":".^.^.^.9"},null]}],"nop","\n","ev",{"VAR?":"pos"},1,{"x()":"getDecal","exArgs":2},4,"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"VAR?":"pos"},1,{"^->":"open_gate"},{"f()":"double_sided"},"pop","/ev","\n",{"->":".^.^.^.19"},null]}],"nop","\n","ev",{"VAR?":"pos"},2,{"x()":"getDecal","exArgs":2},4,"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"VAR?":"pos"},2,{"^->":"open_gate"},{"f()":"double_sided"},"pop","/ev","\n",{"->":".^.^.^.29"},null]}],"nop","\n","ev",{"VAR?":"pos"},3,{"x()":"getDecal","exArgs":2},4,"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"VAR?":"pos"},3,{"^->":"open_gate"},{"f()":"double_sided"},"pop","/ev","\n",{"->":".^.^.^.39"},null]}],"nop","\n",{"#f":3}],"close_arena_gate":[{"temp=":"pos"},"ev",{"VAR?":"pos"},0,{"x()":"getDecal","exArgs":2},5,"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"VAR?":"pos"},0,{"^->":"close_gate"},{"f()":"double_sided"},"pop","/ev","\n",{"->":".^.^.^.9"},null]}],"nop","\n","ev",{"VAR?":"pos"},1,{"x()":"getDecal","exArgs":2},5,"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"VAR?":"pos"},1,{"^->":"close_gate"},{"f()":"double_sided"},"pop","/ev","\n",{"->":".^.^.^.19"},null]}],"nop","\n","ev",{"VAR?":"pos"},2,{"x()":"getDecal","exArgs":2},5,"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"VAR?":"pos"},2,{"^->":"close_gate"},{"f()":"double_sided"},"pop","/ev","\n",{"->":".^.^.^.29"},null]}],"nop","\n","ev",{"VAR?":"pos"},3,{"x()":"getDecal","exArgs":2},5,"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"VAR?":"pos"},3,{"^->":"close_gate"},{"f()":"double_sided"},"pop","/ev","\n",{"->":".^.^.^.39"},null]}],"nop","\n",{"#f":3}],"arena":["#","^enter: Arena","/#","ev",{"VAR?":"arenaOpen"},{"x()":"isArenaFightPending"},"==","/ev",[{"->":".^.b","c":true},{"b":["\n","ev",{"VAR?":"arenaOpen"},"!","/ev",{"VAR=":"arenaOpen","re":true},"ev",{"VAR?":"arenaOpen"},"/ev",[{"->":".^.b","c":true},{"b":["\n","ev","str","^ArenaGate","/str",{"^->":"open_arena_gate"},{"x()":"forEachTaggedTile","exArgs":2},"pop","/ev","\n","^The gates slide open. The gods are sated.","\n",{"->":".^.^.^.11"},null]}],[{"->":".^.b"},{"b":["\n","ev","str","^ArenaGate","/str",{"^->":"close_arena_gate"},{"x()":"forEachTaggedTile","exArgs":2},"pop","/ev","\n","ev","str","^clank","/str",{"x()":"playSound","exArgs":1},"pop","/ev","\n","^The gate to the arena slams behind you, the gods cheer for blood!","\n",{"->":".^.^.^.11"},null]}],"nop","\n",{"->":"arena.9"},null]}],"nop","^ ","done","\n",null],"arena_fight":["#","^enter: ArenaMiddle","/#","ev",{"x()":"isArenaFightPending"},"/ev",[{"->":".^.b","c":true},{"b":["\n","^The forcs of Mullanginan rally around you!","\n","ev",{"x()":"startArenaFight"},"pop","/ev","\n",{"->":".^.^.^.8"},null]}],[{"->":".^.b"},{"b":["\n","^This is a safe haven... for now.","\n",{"->":".^.^.^.8"},null]}],"nop","^ ","done","\n",null],"global decl":["ev",true,{"VAR=":"arenaOpen"},"/ev","end",null]}],"listDefs":{}}