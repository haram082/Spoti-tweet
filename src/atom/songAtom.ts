import { atom } from "recoil";

export const currentTrackIdState = atom({
    key: "currentTrackIdState" as string,
    default: null as string | null,
});

export const isPlayingState = atom({
    key: "isPlayingState" as string,
    default: false as boolean,
});

export const currentVolumeState = atom({
    key: "currentVolumeState" as string,
    default: 50 as number,
});

export const open = atom({
    key: "open" as string,
    default: true as boolean,
});