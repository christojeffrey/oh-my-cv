import { atom } from 'jotai'

// CV data atom - initial structure based on original app
export const cvDataAtom = atom({
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  sections: {
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  },
  markdown: '# Your Resume\n\nStart writing in markdown...',
  css: '/* Custom styles */\nbody { font-family: Arial, sans-serif; }'
})

// Style/theme atom
export const styleAtom = atom({
  theme: 'default',
  colors: {
    primary: '#000000',
    secondary: '#666666',
  },
  fonts: {
    heading: 'Arial',
    body: 'Arial',
  },
  layout: 'single-column',
})