// Storage service using localforage
import localforage from 'localforage'

export interface CVData {
  id: string
  name: string
  data: any
  createdAt: Date
  updatedAt: Date
}

class StorageService {
  private store = localforage.createInstance({
    name: 'oh-my-cv',
    storeName: 'resumes'
  })

  async createResume(): Promise<CVData | null> {
    try {
      const id = Date.now().toString()
      const resume: CVData = {
        id,
        name: 'Untitled Resume',
        data: {},
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await this.store.setItem(id, resume)
      return resume
    } catch (error) {
      console.error('Failed to create resume:', error)
      return null
    }
  }

  async getResume(id: string): Promise<CVData | null> {
    try {
      return await this.store.getItem(id)
    } catch (error) {
      console.error('Failed to get resume:', error)
      return null
    }
  }

  async updateResume(id: string, data: Partial<CVData>): Promise<void> {
    try {
      const existing = await this.getResume(id)
      if (existing) {
        const updated = { ...existing, ...data, updatedAt: new Date() }
        await this.store.setItem(id, updated)
      }
    } catch (error) {
      console.error('Failed to update resume:', error)
    }
  }

  async deleteResume(id: string): Promise<void> {
    try {
      await this.store.removeItem(id)
    } catch (error) {
      console.error('Failed to delete resume:', error)
    }
  }

  async listResumes(): Promise<CVData[]> {
    try {
      const keys = await this.store.keys()
      const resumes = await Promise.all(
        keys.map(key => this.store.getItem(key))
      )
      return resumes.filter(Boolean) as CVData[]
    } catch (error) {
      console.error('Failed to list resumes:', error)
      return []
    }
  }

  async exportToJSON(): Promise<void> {
    try {
      const resumes = await this.listResumes()
      const dataStr = JSON.stringify(resumes, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'oh-my-cv-backup.json'
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export:', error)
    }
  }

  async importFromJson(jsonStr: string): Promise<void> {
    try {
      const resumes: CVData[] = JSON.parse(jsonStr)
      for (const resume of resumes) {
        await this.store.setItem(resume.id, resume)
      }
    } catch (error) {
      console.error('Failed to import:', error)
    }
  }
}

export const storageService = new StorageService()