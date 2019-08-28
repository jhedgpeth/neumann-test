import UIfx from 'uifx'

import testSound from './sounds/test.mp3';
import snd_busbuy from './sounds/tink.mp3';
import snd_busmult from './sounds/powerup.mp3';
import snd_tabswitch from './sounds/blipple.mp3';
import snd_toggle from './sounds/thump.mp3';
import snd_probelaunch from './sounds/probe_launch.mp3';
import snd_probefail from './sounds/probe_fail.mp3';

import HelperConst from './HelperConst';
const mylog = HelperConst.DebugLog;

let sndlist = {

    test: new UIfx(
        testSound,
      {
        volume: 0.1, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    ),
    busbuy: new UIfx(
        snd_busbuy,
      {
        volume: 0.1, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    ),
    busmult: new UIfx(
        snd_busmult,
      {
        volume: 0.1, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    ),
    powerup: new UIfx(
        snd_busmult,
      {
        volume: 0.1, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    ),
    tabswitch: new UIfx(
        snd_tabswitch,
      {
        volume: 0.1, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    ),
    toggle: new UIfx(
        snd_toggle,
      {
        volume: 0.1, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    ),
    probelaunch: new UIfx(
        snd_probelaunch,
      {
        volume: 0.1, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    ),
    probefail: new UIfx(
        snd_probefail,
      {
        volume: 0.1, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    ),




};


export default class Sounds {

    static playSound(snd) {
        if (sndlist[snd]) {
            sndlist[snd].play();
        } else {
            mylog("no sound for",snd);
        }
    }
}
