/**
 * Domain types for CV/Resume functionality
 * Single source of truth for all resume-related type definitions
 */

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

export interface SystemData {
    markdown: string;
    css: string;
    resumeId: number | null;
    resumeName: string;
    styles: ResumeStyles;
    loaded: boolean;
}

export type ValidPaperSize = "A4" | "letter" | "legal";
