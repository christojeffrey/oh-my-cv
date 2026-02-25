import { atom } from "jotai";

export const isSettingsOpenAtom = atom(false);
export const isPreviewOpenAtom = atom(false);
export const isDeleteDialogOpenAtom = atom(false);
export const editorModeAtom = atom<"markdown" | "css">("markdown");