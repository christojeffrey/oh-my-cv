import { atom } from "jotai";

// UI state atoms
export const isLoadingAtom = atom(false);
export const currentViewAtom = atom("dashboard"); // 'dashboard' | 'editor' | 'preview'

// Modal/dialog states
export const showNewResumeDialogAtom = atom(false);
export const showExportDialogAtom = atom(false);
