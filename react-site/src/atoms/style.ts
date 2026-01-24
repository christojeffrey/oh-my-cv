import { atom } from 'jotai'

// Style/theme atom - matching original Vue app features
export interface ResumeStyles {
  marginV: number;
  marginH: number;
  lineHeight: number;
  paragraphSpace: number;
  themeColor: string;
  fontCJK: {
    name: string;
    fontFamily: string;
  };
  fontEN: {
    name: string;
  };
  fontSize: number;
  paper: string;
}

export const styleAtom = atom<ResumeStyles>({
  marginV: 50,
  marginH: 45,
  lineHeight: 1.3,
  paragraphSpace: 5,
  themeColor: '#377bb5',
  fontCJK: {
    name: "华康宋体",
    fontFamily: "HKST"
  },
  fontEN: {
    name: "Minion Pro"
  },
  fontSize: 15,
  paper: "A4"
})

// Dark mode atom - 'light' | 'dark' | 'system'
export const darkModeAtom = atom<'light' | 'dark' | 'system'>('system')