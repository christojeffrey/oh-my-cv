import { atom } from 'jotai'

// Dark mode atom - 'light' | 'dark' | 'system'
export const darkModeAtom = atom<'light' | 'dark' | 'system'>('system')