import localforage from "localforage";
import { DEFAULT_RESUME_CSS, DEFAULT_RESUME_MARKDOWN } from "@/constants/templates/default";

export interface Font {
  name: string;
  fontFamily?: string;
}

export interface ResumeStyles {
  marginV: number;
  marginH: number;
  lineHeight: number;
  paragraphSpace: number;
  themeColor: string;
  fontCJK: Font;
  fontEN: Font;
  fontSize: number;
  paper: "A4" | "letter" | "legal";
}

export interface DbResume {
  id: number;
  name: string;
  markdown: string;
  css: string;
  styles: ResumeStyles;
  created_at: Date;
  updated_at: Date;
}

class StorageService {
  private readonly store = localforage.createInstance({
    name: "oh-my-cv",
    storeName: "resumes",
  });

  private readonly VERSION = "0.1.1";

  async getResumes(): Promise<DbResume[]> {
    try {
      const keys = await this.store.keys();
      const resumes: DbResume[] = [];
      for (const key of keys) {
        const item = await this.store.getItem<DbResume>(String(key));
        if (item) {
          resumes.push(item);
        }
      }
      return resumes;
    } catch (error) {
      console.error("Failed to get resumes:", error);
      return [];
    }
  }

  async createResume(data?: Partial<DbResume>): Promise<DbResume | null> {
    try {
      const id = Date.now();
      const now = new Date();
      const resume: DbResume = {
        id,
        name: "Untitled Resume",
        markdown: DEFAULT_RESUME_MARKDOWN,
        css: DEFAULT_RESUME_CSS,
        styles: {
          marginV: 50,
          marginH: 45,
          lineHeight: 1.3,
          paragraphSpace: 5,
          themeColor: "#377bb5",
          fontCJK: {
            name: "华康宋体",
            fontFamily: "HKST",
          },
          fontEN: {
            name: "Minion Pro",
          },
          fontSize: 15,
          paper: "A4",
        },
        created_at: now,
        updated_at: now,
        ...data,
      };
      await this.store.setItem(String(id), resume);
      return resume;
    } catch (error) {
      console.error("Failed to create resume:", error);
      return null;
    }
  }

  async updateResume(
    id: number,
    data: Partial<DbResume>,
    newUpdateTime = true
  ): Promise<DbResume | null> {
    try {
      const existing = await this.getResume(id);
      if (existing) {
        const updated = {
          ...existing,
          ...data,
          updated_at: newUpdateTime ? new Date() : existing.updated_at,
        };
        await this.store.setItem(String(id), updated);
        return updated;
      }
      return null;
    } catch (error) {
      console.error("Failed to update resume:", error);
      return null;
    }
  }

  async deleteResume(id: number): Promise<DbResume | null> {
    try {
      const existing = await this.getResume(id);
      await this.store.removeItem(String(id));
      return existing;
    } catch (error) {
      console.error("Failed to delete resume:", error);
      return null;
    }
  }

  async getResume(id: number): Promise<DbResume | null> {
    try {
      return await this.store.getItem<DbResume>(String(id));
    } catch (error) {
      console.error("Failed to get resume:", error);
      return null;
    }
  }

  async duplicateResume(id: number): Promise<DbResume | null> {
    try {
      const original = await this.getResume(id);
      if (!original) return null;

      const newResume = await this.createResume({
        name: original.name + " Copy",
        markdown: original.markdown,
        css: original.css,
        styles: { ...original.styles },
      });
      return newResume;
    } catch (error) {
      console.error("Failed to missing resume:", error);
      return null;
    }
  }

  async exportToJSON(): Promise<void> {
    try {
      const resumes = await this.getResumes();
      const data: Record<number, Omit<DbResume, "id" | "created_at" | "updated_at">> = {};
      for (const resume of resumes) {
        const { id, created_at, updated_at, ...rest } = resume;
        data[id] = rest;
      }

      const json = {
        version: this.VERSION,
        data,
      };

      const dataStr = JSON.stringify(json, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ohmycv_data.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export:", error);
    }
  }

  async importFromJson(content: string): Promise<boolean> {
    try {
      const json = JSON.parse(content);

      // Validate version
      if (json.version !== this.VERSION) {
        console.warn("Import data version mismatch:", json.version, "expected:", this.VERSION);
        return false;
      }

      // Import resumes
      const resumes: Record<
        number,
        Omit<DbResume, "id" | "created_at" | "updated_at">
      > = json.data || {};
      for (const [id, resumeData] of Object.entries(resumes)) {
        const resume: DbResume = {
          id: Date.now() + Number.parseInt(id),
          ...resumeData,
          created_at: new Date(),
          updated_at: new Date(),
        };
        await this.store.setItem(String(resume.id), resume);
      }

      return true;
    } catch (error) {
      console.error("Failed to import:", error);
      return false;
    }
  }
}

export const storageService = new StorageService();
