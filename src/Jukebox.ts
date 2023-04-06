import Engine from "./Engine";

import komfortZoneUrl from "../res/music/komfort-zone.ogg";
import modDotVigorUrl from "../res/music/mod-dot-vigor.ogg";
import selumeUrl from "../res/music/selume.ogg";
import { random } from "./tools/rng";
import { wrap } from "./tools/numbers";

interface Track {
  url: string;
  name: string;
  audio?: HTMLAudioElement;
}

interface Playlist {
  tracks: Track[];
  between?: { roll: number; bonus: number };
}

const PlaylistNames = ["explore", "combat"] as const;
type PlaylistName = (typeof PlaylistNames)[number];

const komfortZone: Track = { name: "komfort zone", url: komfortZoneUrl };
const modDotVigor: Track = { name: "mod dot vigor", url: modDotVigorUrl };
const selume: Track = { name: "selume", url: selumeUrl };

const playlists: Record<PlaylistName, Playlist> = {
  explore: {
    tracks: [komfortZone, selume],
    between: { roll: 20, bonus: 10 },
  },
  combat: { tracks: [modDotVigor] },
};

export default class Jukebox {
  delayTimer?: ReturnType<typeof setTimeout>;
  playing?: Track;
  playlist?: Playlist;
  index: number;
  wantToPlay?: PlaylistName;

  constructor(public g: Engine) {
    this.index = 0;

    g.eventHandlers.onPartyMove.add(this.tryPlay);
    g.eventHandlers.onPartySwap.add(this.tryPlay);
    g.eventHandlers.onPartyTurn.add(this.tryPlay);
  }

  private async acquire(track: Track) {
    if (!track.audio) {
      const audio = await this.g.res.loadAudio(track.url);
      audio.addEventListener("ended", this.trackEnded);
      track.audio = audio;
    }

    return track;
  }

  get status() {
    if (this.delayTimer) return "between tracks";
    if (!this.playing) return "idle";
    return `playing: ${this.playing.name}`;
  }

  private cancelDelay() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = undefined;
    }
  }

  async play(p: PlaylistName) {
    this.cancelDelay();
    this.wantToPlay = p;
    this.playing?.audio?.pause();

    const playlist = playlists[p];
    this.playlist = playlist;
    this.index = random(playlist.tracks.length);
    await this.start();
  }

  async start() {
    if (!this.playlist) return;

    this.cancelDelay();
    const track = this.playlist.tracks[this.index];
    this.playing = await this.acquire(track);
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.playing.audio!.play();
      this.playing = track;
      this.wantToPlay = undefined;
    } catch (e) {
      console.warn(e);
      this.playing = undefined;
    }
  }

  stop() {
    if (this.playing) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.playing.audio!.pause();
      this.playing = undefined;
    }
  }

  private trackEnded = () => {
    const { playlist } = this;
    if (!playlist) return;

    if (playlist.between) {
      const delay = random(playlist.between.roll) + playlist.between.bonus;
      if (delay) {
        this.delayTimer = setTimeout(this.next, delay * 1000);
        return;
      }
    }

    this.next();
  };

  private next = () => {
    const { index, playlist } = this;
    if (!playlist) return;

    this.cancelDelay();
    this.index = wrap(index + 1, playlist.tracks.length);
    void this.start();
  };

  private tryPlay = () => {
    if (this.wantToPlay) {
      const name = this.wantToPlay;
      this.wantToPlay = undefined;
      void this.play(name);
    }
  };
}
