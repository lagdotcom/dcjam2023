import Engine from "./Engine";

import komfortZoneUrl from "../res/music/komfort-zone.ogg";
import modDotVigorUrl from "../res/music/mod-dot-vigor.ogg";
import selumeUrl from "../res/music/selume.ogg";
import { random } from "./tools/rng";
import { wrap } from "./tools/numbers";

interface Playlist {
  tracks: string[];
  between?: { roll: number; bonus: number };
}

const PlaylistNames = ["explore", "combat"] as const;
type PlaylistName = (typeof PlaylistNames)[number];

const playlists: Record<PlaylistName, Playlist> = {
  explore: {
    tracks: [komfortZoneUrl, selumeUrl],
    between: { roll: 20, bonus: 10 },
  },
  combat: { tracks: [modDotVigorUrl] },
};

const trackNames = {
  [komfortZoneUrl]: "komfort zone",
  [modDotVigorUrl]: "mod dot vigor",
  [selumeUrl]: "selume",
};

export default class Jukebox {
  delayTimer?: ReturnType<typeof setTimeout>;
  playing?: HTMLAudioElement;
  playingUrl?: string;
  playlist?: Playlist;
  index: number;
  wantToPlay?: PlaylistName;

  constructor(public g: Engine) {
    this.index = 0;

    g.eventHandlers.onPartyMove.add(this.tryPlay);
    g.eventHandlers.onPartySwap.add(this.tryPlay);
    g.eventHandlers.onPartyTurn.add(this.tryPlay);
  }

  private async acquire(url: string) {
    const audio = await this.g.res.loadAudio(url);
    audio.addEventListener("ended", this.trackEnded);
    return audio;
  }

  get status() {
    if (this.delayTimer) return "between tracks";
    if (!this.playingUrl) return "idle";
    return `playing: ${trackNames[this.playingUrl]}`;
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
    this.playing?.pause();

    const playlist = playlists[p];
    this.playlist = playlist;
    this.index = random(playlist.tracks.length);
    await this.start();
  }

  async start() {
    if (!this.playlist) return;

    this.cancelDelay();
    const url = this.playlist.tracks[this.index];
    this.playing = await this.acquire(url);
    try {
      await this.playing.play();
      this.playingUrl = url;
      this.wantToPlay = undefined;
    } catch (e) {
      console.warn(e);
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
