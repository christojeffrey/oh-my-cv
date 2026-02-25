/**
 * Domain types for CV/Resume functionality
 * Single source of truth for all resume-related type definitions
 */

export interface Font {
    name: string;
    fontFamily?: string;
}

export interface ResumeConfiguration {
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
    id: string;
    name: string;
    markdown: string;
    customCss: string;
    configuration: ResumeConfiguration;
    created_at: Date;
    updated_at: Date;
}

export interface Resume {
    markdown: string;
    customCss: string;
    resumeId: string | null;
    resumeName: string;
    configuration: ResumeConfiguration;
    loaded: boolean;
}

export type ValidPaperSize = "A4" | "letter" | "legal";
