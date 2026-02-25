import { atom } from "jotai";

// Use writable atom patterns to ensure updates propagate
const settingsOpenBase = atom(false);
const previewOpenBase = atom(false);
const editorModeBase = atom<"markdown" | "css">("markdown");

export const isSettingsOpenAtom = atom(
  (get) => get(settingsOpenBase),
  (get, set, update: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof update === "function" ? (update as (prev: boolean) => boolean)(get(settingsOpenBase)) : update;
    set(settingsOpenBase, next);
  }
);

export const isPreviewOpenAtom = atom(
  (get) => get(previewOpenBase),
  (get, set, update: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof update === "function" ? (update as (prev: boolean) => boolean)(get(previewOpenBase)) : update;
    set(previewOpenBase, next);
  }
);

export const editorModeAtom = editorModeBase;
