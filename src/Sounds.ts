import buff1Url from "../res/sfx/buff1.ogg";
import clankUrl from "../res/sfx/clank.ogg";
import cry1Url from "../res/sfx/cry1.ogg";
import death1Url from "../res/sfx/death1.ogg";
import wooshUrl from "../res/sfx/woosh.ogg";
import Engine from "./Engine";

const allSounds = {
  buff1: buff1Url,
  clank: clankUrl,
  cry1: cry1Url,
  death1: death1Url,
  woosh: wooshUrl,
};
export type SoundName = keyof typeof allSounds;

export function isSoundName(name: string): name is SoundName {
  return typeof allSounds[name as SoundName] === "string";
}

export default class Sounds {
  constructor(public g: Engine) {
    // pre-emptively load all sounds
    for (const url of Object.values(allSounds)) void g.res.loadAudio(url);

    g.eventHandlers.onKilled.add(
      ({ who }) => void this.play(who.isPC ? "cry1" : "death1")
    );
  }

  async play(name: SoundName) {
    const audio = await this.g.res.loadAudio(allSounds[name]);
    audio.currentTime = 0;
    await audio.play();
  }
}
