import type { ResumeConfiguration } from "@/types/resume";

export function generateConfigurationStyles(resumeConfiguration: ResumeConfiguration) {
  return `
* {
  font-family: ${resumeConfiguration.fontEN?.fontFamily};
  line-height: ${resumeConfiguration.lineHeight};
  font-size: ${resumeConfiguration.fontSize}px;
}

p, li {
  margin-bottom: ${resumeConfiguration.paragraphSpace}px;
}

h2, h3 {
  margin-bottom: ${resumeConfiguration.paragraphSpace}px;
}

.resume-header h1 {
  color: ${resumeConfiguration.themeColor};
}

h2 {
  border-bottom: 1px solid ${resumeConfiguration.themeColor};
}
`;
}
