export const Guide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-4">The Architect’s Blueprint: A Comprehensive Guide to Constructing the Professional Software Developer Resume (2026 Edition)</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. The Strategic Landscape of Technical Hiring in 2026</h2>
        <p>
          The operational reality of technical recruitment has undergone a fundamental transformation over the last decade, crystallizing in 2026 into a process dominated by algorithmic filtration and rapid human cognitive processing. Understanding this landscape is the prerequisite for constructing a resume that survives the initial cull. The modern software developer resume acts as a data packet that must first traverse a digital gateway—the Applicant Tracking System (ATS)—before reaching the visual cortex of a human hiring manager.
        </p>

        <h3 className="text-xl font-medium">1.1 The Algorithmic Gatekeeper: ATS Hegemony</h3>
        <p>
          In the current hiring ecosystem, statistical analysis indicates that over 97% of technology companies employ Applicant Tracking Systems (ATS) to manage their recruitment pipelines. These systems are not merely digital filing cabinets; they are active filters designed to rank, sort, and often reject applications based on keyword density, formatting compliance, and semantic relevance to the job description. The implication for the candidate is binary: a resume is either machine-readable, or it is invisible.
        </p>
        <p>
          The parsing logic of these systems dictates the structural choices a candidate must make. ATS algorithms generally parse text linearly, reading from left to right and top to bottom. This mechanical reality renders complex visual layouts—such as double columns, sidebars, and floating text boxes—hazardous. When an ATS encounters a multi-column layout, it often misinterprets the reading order, merging the "Skills" column on the left with the "Experience" column on the right, resulting in a garbled data entry that fails keyword matching protocols. Consequently, the industry standard has shifted decisively back to single-column, text-based layouts that prioritize data integrity over aesthetic flair.
        </p>

        <h3 className="text-xl font-medium">1.2 The Human Element: The Six-Second Scan</h3>
        <p>
          Once a resume passes the algorithmic filter, it reaches a human reviewer—typically a technical recruiter or a hiring manager. Eye-tracking studies and industry surveys reveal a stark reality: these reviewers spend an average of six to seven seconds on their initial scan of a resume. This constrained timeframe necessitates a document architecture that facilitates an "F-shaped" reading pattern, where the eye scans the top headers and then proceeds down the left margin, looking for specific anchors: companies, titles, dates, and tech stacks.
        </p>
        <p>
          The psychological burden on the reviewer is high. They are often processing hundreds of applications daily. Therefore, the resume must function as a high-efficiency information delivery system. It must answer three questions immediately: Can this person do the job? do they have the requisite experience level? And do they possess the specific technical skills required?. Any friction in finding this information—whether due to poor formatting, vague terminology, or excessive "fluff"—increases the probability of rejection. The goal is to move the reviewer from "scanning" to "reading" by presenting compelling, quantified evidence of impact within that critical six-second window.
        </p>

        <h3 className="text-xl font-medium">1.3 The Purpose of the Document</h3>
        <p>
          A fundamental misconception among candidates is that the resume’s purpose is to secure a job offer. In reality, the resume has a singular, tactical objective: to secure an interview. It is a marketing brochure, not a biography. This distinction is crucial because it governs what information to include and, more importantly, what to exclude. Every line on the resume must serve the narrative that the candidate is a high-impact engineer capable of solving the specific problems the hiring company faces. Information that does not directly support this narrative—such as unrelated hobbies, outdated technologies, or generic soft skill claims—consumes valuable real estate and dilutes the signal-to-noise ratio.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Structural Engineering: Layout and Formatting Protocols</h2>
        <p>
          The visual structure of a resume is the framework upon which the content rests. If the framework is flawed, the content collapses. In 2026, the formatting standards for software engineers are rigid, driven by the technical constraints of ATS and the readability requirements of human reviewers.
        </p>

        <h3 className="text-xl font-medium">2.1 The Single-Column Mandate</h3>
        <p>
          As previously noted, the single-column layout is the gold standard for technical resumes. While two-column layouts allow for more content density, they introduce a high risk of parsing errors. Many legacy ATS parsers struggle to distinguish between columns, often concatenating lines from adjacent columns into nonsensical strings. For example, a skill listed in a sidebar might be appended to a job title in the main body, confusing the parser about the candidate's actual role.
        </p>
        <p>
          From a human perspective, single-column layouts control the reader's eye movement more effectively. They enforce a linear narrative flow, ensuring that the reviewer reads the professional summary first, followed by skills, and then experience, in the exact order the candidate intends. This linearity reduces cognitive load, making it easier for the reviewer to digest the candidate's career progression.
        </p>

        <h3 className="text-xl font-medium">2.2 Typography and Readability</h3>
        <p>
          The choice of font and spacing is not a matter of artistic expression but of functional utility. The resume must be legible on screens of varying sizes and resolutions.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Font Selection:</strong> Sans-serif fonts are preferred for their clean lines and on-screen readability. Arial, Calibri, Helvetica, and Roboto are safe, professional choices. Times New Roman, while traditional, can appear dated in the modern tech context.</li>
          <li><strong>Font Size:</strong> The body text should be between 10pt and 12pt. Going below 10pt to "cram" more information onto the page is a critical error; it strains the reader's eyes and suggests an inability to edit and prioritize information. Headers should be distinctly larger (14pt-16pt) to act as visual signposts.</li>
          <li><strong>Margins:</strong> Standard margins of 0.5 to 1 inch are recommended. Margins provide "white space," which is essential for preventing the document from looking like a dense wall of text. A crowded resume is psychologically exhausting to read and is often skipped.</li>
          <li><strong>Bold and Italics:</strong> These formatting tools should be used strategically to highlight key information, such as company names, job titles, or specific metrics. However, they should be used sparingly; if everything is highlighted, nothing is highlighted.</li>
        </ul>

        <h3 className="text-xl font-medium">2.3 Length Constraints: The One-Page Rule</h3>
        <p>
          For the vast majority of software engineers, the one-page resume is the strict standard. This constraint forces the candidate to prioritize their most impactful work and demonstrates the ability to communicate concisely—a valuable engineering skill.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Junior to Mid-Level (0-10 years):</strong> One page is mandatory. Recruiters do not need to know about every project or internship; they need the highlights.</li>
          <li><strong>Senior/Staff/Principal (10+ years):</strong> A two-page resume is acceptable, provided that the second page is justified by a depth of relevant technical leadership and architectural experience. However, even for senior roles, a concise one-pager often outperforms a two-pager filled with older, less relevant experience.</li>
        </ul>

        <h3 className="text-xl font-medium">2.4 File Format and Naming Conventions</h3>
        <p>
          The delivery mechanism for the resume is the digital file itself.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>PDF is King:</strong> Unless a job description explicitly requests a Microsoft Word document (often required by legacy recruiting agencies for editing purposes), the resume should always be submitted as a PDF. PDF locks the formatting, ensuring that what the candidate sees on their screen is exactly what the recruiter sees, regardless of their operating system or software version.</li>
          <li><strong>Filename Protocol:</strong> A file named Resume.pdf or CV_Final.pdf is professional negligence. It creates administrative friction for the recruiter who downloads it. The filename should include the candidate’s name and the role they are targeting.
            <ul className="list-circle pl-5 mt-1">
               <li><strong>Recommended Format:</strong> FirstName_LastName_Role_Resume.pdf (e.g., Jordan_Smith_Frontend_Engineer_Resume.pdf). This ensures the file is easily searchable and identifiable in a crowded download folder.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. The Header: Optimizing Digital Identity</h2>
        <p>
          The header is the first section of the resume, and its primary function is to facilitate contact and verify digital presence. In the context of software engineering, it also serves as a portal to the candidate's portfolio and code samples.
        </p>

        <h3 className="text-xl font-medium">3.1 Essential Components</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Name:</strong> The name should be the largest text on the page, clearly establishing identity.</li>
          <li><strong>Contact Information:</strong> A professional email address and a phone number are mandatory. The email address should be simple (e.g., firstname.lastname@email.com) rather than a relic from adolescence (e.g., coding_ninja_99@email.com).</li>
          <li><strong>Location:</strong> In an era of remote work and privacy concerns, full physical addresses are obsolete. Listing the "City, State" (e.g., "Austin, TX") is sufficient. It signals time zone compatibility and relocation needs without exposing personal data.</li>
        </ul>

        <h3 className="text-xl font-medium">3.2 Professional Links: GitHub and LinkedIn</h3>
        <p>
          For software developers, the resume is only part of the story. The GitHub profile and LinkedIn page provide the evidence to back up the claims made in the document.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>LinkedIn:</strong> Recruiters almost universally cross-reference resumes with LinkedIn profiles. The URL should be customized (e.g., linkedin.com/in/jordan-smith) to look clean.</li>
          <li><strong>GitHub/Portfolio:</strong> A link to a GitHub profile or a personal portfolio website is highly recommended, provided the content is curated. This allows technical hiring managers to inspect code quality, architectural thinking, and contribution history.
            <ul className="list-circle pl-5 mt-1">
               <li><strong>Strategic Linking:</strong> If a candidate has a specific project that is particularly impressive, they can link directly to that repository in the header or the projects section, rather than just the general profile. This directs the reviewer's attention immediately to the best work.</li>
            </ul>
          </li>
        </ul>

        <h3 className="text-xl font-medium">3.3 Visual Hygiene</h3>
        <p>
          The header should be clean and uncluttered. Icons for email, phone, and social links can save space and add a modern touch, but they must be simple and consistent in style. The use of photos or headshots is generally discouraged in the United States and UK markets, as it can introduce unconscious bias and is not standard practice for technical roles.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. The Professional Summary: Replacing the Objective</h2>
        <p>
          One of the most significant shifts in resume conventions over the last few years is the retirement of the "Objective Statement." In 2026, telling an employer what you want ("Seeking a challenging position to grow my skills") is viewed as passive and self-centered. It has been replaced by the "Professional Summary"—a concise, value-driven pitch that tells the employer what you can do for them.
        </p>

        <h3 className="text-xl font-medium">4.1 The Psychology of the Summary</h3>
        <p>
          The Professional Summary acts as the "hook" of the resume. It sits at the top of the page (below the header) and is likely the first thing read. Its purpose is to frame the rest of the document, establishing the candidate's seniority, core technical competence, and primary value proposition immediately. A strong summary can increase interview callback rates by providing the recruiter with immediate context and key search terms.
        </p>

        <h3 className="text-xl font-medium">4.2 The Summary Formula</h3>
        <p>
          A high-impact summary typically follows a specific structure:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Identity & Experience:</strong> Current title and years of experience.</li>
          <li><strong>Core Competencies:</strong> Top 3-4 technical skills or areas of expertise relevant to the target role.</li>
          <li><strong>Key Achievement:</strong> A specific, quantified win that demonstrates impact.</li>
        </ul>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Feature</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">The Old Way (Objective)</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">The New Way (Professional Summary)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Focus</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Candidate's needs ("I want to learn...").</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Employer's value ("I can deliver...").</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Content</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Vague aspirations.</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Specific metrics and skills.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Tone</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Passive request.</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Active offer of expertise.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Keywords</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Low density.</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">High density (ATS optimized).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-medium">4.3 Examples by Role</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Mid-Level Backend Developer:</strong> "Backend Engineer with 5+ years of experience building scalable microservices using Java and Spring Boot. Expert in distributed systems design, RESTful API development, and cloud infrastructure on AWS (EC2, RDS). Led the optimization of a high-throughput payment processing engine, reducing transaction latency by 40% and supporting 50k daily active users."
          </li>
          <li>
            <strong>Senior Full Stack Engineer:</strong> "Senior Full Stack Developer with 8 years of experience architecting end-to-end web solutions. Proficient in React, Node.js, and TypeScript, with a strong focus on cloud-native deployments via Kubernetes. Spearheaded the migration of a legacy monolith to a serverless architecture, cutting infrastructure costs by 30% while improving system uptime to 99.99%."
          </li>
          <li>
            <strong>Junior Developer (Career Changer):</strong> "Motivated Software Developer with a strong foundation in Python and JavaScript, backed by a rigorous bootcamp certification and a portfolio of deployed web applications. Passionate about automated testing and clean code principles. Developed a full-stack e-commerce platform handling real-time inventory management, demonstrating rapid learning and practical problem-solving skills."
          </li>
        </ul>
        <p>
          By tailoring the summary to include keywords from the job description (e.g., specific languages or frameworks), the candidate significantly improves their chances of passing the ATS filter while simultaneously impressing the human reader with relevance.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Technical Skills: The Taxonomy of Competence</h2>
        <p>
          For a software engineer, the "Skills" section is the engine room of the resume. It is the primary target for ATS keyword scanners and the checklist against which recruiters validate the candidate's viability. However, a disorganized "wall of text" listing every technology ever touched is a major red flag. It suggests a lack of focus and makes it difficult to assess true depth of knowledge.
        </p>

        <h3 className="text-xl font-medium">5.1 Categorization Strategy</h3>
        <p>
          To maximize readability and impact, technical skills must be categorized logically. This allows the recruiter to quickly assess the candidate's stack (e.g., "Is this a Java shop match?").
        </p>
        <p>Recommended Categories:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Languages:</strong> (e.g., JavaScript, Python, Java, Go, C++, Rust, TypeScript).</li>
          <li><strong>Frontend:</strong> (e.g., React, Vue.js, Angular, Next.js, HTML5, CSS3, Tailwind).</li>
          <li><strong>Backend:</strong> (e.g., Node.js, Express, Django, Spring Boot, GraphQL, REST APIs).</li>
          <li><strong>Databases:</strong> (e.g., PostgreSQL, MongoDB, Redis, MySQL, DynamoDB).</li>
          <li><strong>Infrastructure/Cloud:</strong> (e.g., AWS, Azure, Google Cloud, Docker, Kubernetes, Terraform).</li>
          <li><strong>Tools/DevOps:</strong> (e.g., Git, Jenkins, CircleCI, Jira).</li>
        </ul>

        <h3 className="text-xl font-medium">5.2 The Hierarchy of Relevance</h3>
        <p>
          Not all skills are created equal. The order of skills within these categories should reflect the candidate's proficiency and the relevance to the job being applied for. The strongest skills should be listed first.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Strategic Omission:</strong> Basic computer literacy skills (e.g., "Microsoft Word," "Email," "Windows") should be removed. In 2026, these are assumed competencies for a software engineer and listing them wastes space.</li>
          <li><strong>Version Control:</strong> Specific versions (e.g., "Java 8") should only be listed if the job description explicitly asks for them or if they demonstrate legacy maintenance capability. Otherwise, the general language name ("Java") is sufficient and broader.</li>
        </ul>

        <h3 className="text-xl font-medium">5.3 High-Impact Keywords for 2026</h3>
        <p>
          The following keywords are identified as high-value in the 2026 market, categorized by domain. Integrating these into the skills section (and the experience bullets) is critical for ATS optimization.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Domain</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Key Technologies & Concepts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Languages</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">TypeScript, Go (Golang), Rust, Python (Data/AI focus), Swift, Kotlin.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Frontend</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">React, Next.js, State Management (Redux/Zustand), Tailwind CSS, Webpack, Vite.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Backend</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Microservices, Event-Driven Architecture, gRPC, GraphQL, REST APIs, Node.js.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Cloud/Infra</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">AWS (Lambda, S3, EC2), Kubernetes, Docker, Terraform, Serverless.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Testing</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Cypress, Jest, TDD (Test Driven Development), E2E Testing.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">AI/ML</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">LLM Integration, OpenAI API, Prompt Engineering (applied), Copilot-assisted Dev.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-medium">5.4 Handling AI and Modern Tools</h3>
        <p>
          As AI tools like GitHub Copilot and ChatGPT become standard in the developer workflow, listing them requires nuance. Simply listing "ChatGPT" can look like padding. Instead, these should be framed as productivity enhancers or integration skills.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Example:</strong> "AI-Assisted Development (Copilot), LLM Integration, OpenAI API."</li>
          <li>The focus should remain on engineering skills—system design, architecture, coding—rather than just the ability to use a tool.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Professional Experience: The Core Narrative</h2>
        <p>
          The "Work Experience" section is the most heavily weighted component of the resume. It is where the claims made in the summary and skills sections are substantiated with evidence. This section must be formatted in reverse chronological order (most recent job first) and must prioritize achievements over responsibilities.
        </p>

        <h3 className="text-xl font-medium">6.1 The "XYZ Formula" and Achievement-Based Writing</h3>
        <p>
          A common mistake is treating the experience section as a job description, listing duties like "Responsible for writing code" or "Attended daily stand-ups." This tells the recruiter what you did, but not how well you did it.
        </p>
        <p>
          To communicate impact, industry experts (including those from Google) recommend the XYZ Formula: "Accomplished [X] as measured by, by doing [Z]".
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>X (The Achievement):</strong> What did you accomplish?</li>
          <li><strong>Y (The Metric):</strong> How was it measured? (Numbers, percentages, time).</li>
          <li><strong>Z (The Action):</strong> How did you do it? (technologies used, strategies employed).</li>
        </ul>

        <h3 className="text-xl font-medium">6.2 Quantifying Impact</h3>
        <p>
          Engineers work in a world of numbers—latency, uptime, revenue, users. The resume should reflect this. Quantifying achievements gives them credibility and scale.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Volume:</strong> "Processed 5TB of data daily..." / "Scaled to 100k concurrent users..."</li>
          <li><strong>Efficiency:</strong> "Reduced build time by 50%..." / "Optimized query latency from 500ms to 50ms..."</li>
          <li><strong>Business:</strong> "Generated $50k in additional monthly revenue..." / "Cut infrastructure costs by 20%..."</li>
        </ul>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Weak / Vague (Task-Based)</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Strong / Impactful (Result-Based)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">"Created APIs for the mobile app."</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">"Designed and deployed 15+ RESTful APIs for the mobile application using Node.js, supporting 50k daily active users with 99.9% uptime."</td>
              </tr>
              <tr>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">"Fixed bugs in the system."</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">"Diagnosed and resolved a critical memory leak in the payment processing service, reducing server crashes by 90% and improving customer trust."</td>
              </tr>
              <tr>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">"Used React to build web pages."</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">"Re-architected the legacy frontend using React and Redux, improving page load speed by 40% and boosting SEO rankings."</td>
              </tr>
              <tr>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">"Managed the database."</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">"Optimized PostgreSQL database schemas and indexing strategies, resulting in a 30% reduction in query execution time for reporting dashboards."</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-medium">6.3 Action Verbs vs. Buzzwords</h3>
        <p>
          The choice of verbs sets the tone of the resume. Passive words like "Helped," "Worked on," or "Responsible for" suggest a lack of ownership. Active "Power Verbs" demonstrate leadership and technical agency.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Strong Technical Verbs:</strong> Architected, Engineered, Deployed, Automated, Optimized, Refactored, Migrated, Dockerized, Scaled.</li>
          <li><strong>Strong Leadership Verbs:</strong> Spearheaded, Mentored, Orchestrated, Led, Directed, Initiated.</li>
        </ul>
        <p>
          Buzzwords to Avoid: "Team player," "Hard worker," "Synergy," "Go-getter." These are subjective and occupy space that could be used for technical facts.
        </p>

        <h3 className="text-xl font-medium">6.4 Handling Senior vs. Junior Experience</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Senior Developers:</strong> Focus on leadership, system design, and mentoring. Bullets should reflect architectural decisions and cross-team collaboration (e.g., "Defined technical strategy for..."). Older positions (10+ years ago) can be summarized or listed with just title and dates to save space.</li>
          <li><strong>Junior Developers:</strong> Focus on the ability to learn and contribute code. Highlight specific features built, bugs fixed, and testing coverage. Use internships and hackathons as "Professional Experience" if full-time history is limited.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Project Portfolios and Open Source Contributions</h2>
        <p>
          For software developers, especially those early in their careers or those transitioning technologies, the "Projects" section is vital. It serves as a practical demonstration of skill where professional experience might be lacking or legally confidential.
        </p>

        <h3 className="text-xl font-medium">7.1 Selection Criteria</h3>
        <p>
          Quality outweighs quantity. Listing 10 tutorial clones (e.g., a simple To-Do list app) is less effective than listing two complex, original projects.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Complexity:</strong> Projects should demonstrate full-stack capabilities, API integration, or complex algorithmic problem solving.</li>
          <li><strong>Relevance:</strong> If applying for a Machine Learning role, highlight Python/TensorFlow projects. If applying for frontend, highlight React/Vue work.</li>
        </ul>

        <h3 className="text-xl font-medium">7.2 The Repository as a Product</h3>
        <p>
          When linking to a GitHub repository, the candidate must treat the repo as a product for the recruiter.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>The README.md:</strong> This is non-negotiable. A pinned repository with no README is a red flag. The README should explain:
            <ul className="list-circle pl-5 mt-1">
               <li>What the project does.</li>
               <li>The tech stack used.</li>
               <li>How to install and run it.</li>
               <li>Screenshots or a link to a live demo.</li>
            </ul>
          </li>
          <li><strong>Live Demos:</strong> Whenever possible, deploy the project (using Vercel, Netlify, or AWS) and provide a clickable link. Recruiters rarely have time to clone and build code; they want to see it working.</li>
        </ul>

        <h3 className="text-xl font-medium">7.3 Highlighting Open Source</h3>
        <p>
          Contributing to open source software (OSS) is a powerful differentiator. It proves the candidate can navigate large codebases, collaborate with a distributed team, and write code that meets strict standards.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Placement:</strong> Major contributions (e.g., being a maintainer) warrant a dedicated "Open Source Contributions" section. Smaller contributions can be listed under "Projects" or "Volunteering."</li>
          <li><strong>Description:</strong> Use the same impact metrics as job experience. "Merged 5 PRs into the React core library improving accessibility for screen readers" is a massive signal of competence.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Education and Certifications</h2>

        <h3 className="text-xl font-medium">8.1 Education Placement and Content</h3>
        <p>
          The placement of the Education section depends entirely on the candidate's seniority.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Recent Graduates:</strong> Place Education at the top, above Experience. This signals that the lack of extensive work history is due to recent schooling.</li>
          <li><strong>Experienced Professionals:</strong> Place Education at the bottom. Once a developer has shipped production code, their degree becomes a check-box item rather than a primary qualification.</li>
          <li><strong>Content:</strong> Degree type (BS/MS), Major (Computer Science, Math, etc.), University Name, and Graduation Year.</li>
          <li><strong>GPA:</strong> Only include the GPA if it is exceptionally high (e.g., &gt;3.5/4.0) and the candidate is a recent grad. Otherwise, remove it.</li>
        </ul>

        <h3 className="text-xl font-medium">8.2 The Value of Certifications</h3>
        <p>
          In the software development world, certifications have mixed value.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Low Value:</strong> Generic coding certifications (e.g., "Java Master Course" from a random website) are generally ignored by top-tier tech companies.</li>
          <li><strong>High Value (Cloud & Security):</strong> Certifications from major cloud providers are highly respected, especially for backend and DevOps roles. They serve as objective validation of complex skills.
            <ul className="list-circle pl-5 mt-1">
               <li><strong>Examples:</strong> AWS Certified Solutions Architect, Google Professional Cloud Architect, Microsoft Certified: Azure Solutions Architect Expert, Certified Kubernetes Administrator (CKA).</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">9. Special Scenarios: Gaps, Old Tech, and Transitions</h2>

        <h3 className="text-xl font-medium">9.1 Handling Employment Gaps</h3>
        <p>
          Gaps in employment are common, but they should be addressed strategically.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Narrative Control:</strong> If the gap was for education, travel, or family, brief explanations can be included in the cover letter or interview. On the resume, focusing on "freelance work," "open source contributions," or "personal upskilling" during that period can bridge the gap.</li>
          <li><strong>Format:</strong> Using years only (e.g., "2024 – 2025") instead of months can smooth over short gaps, though this is sometimes viewed skeptically by background checkers.</li>
        </ul>

        <h3 className="text-xl font-medium">9.2 Managing "Old" or Obsolete Technology</h3>
        <p>
          Listing outdated technology can inadvertently signal that a candidate is "stuck in the past."
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>The 5-Year Rule:</strong> As a general guideline, limit the detailed listing of technologies to those used in the last 5-7 years, unless they are specifically relevant to the target role.</li>
          <li><strong>Legacy Roles:</strong> If a candidate is an expert in a legacy system (e.g., COBOL, Fortran) and is applying for a modernization role (rewriting legacy code), these skills should be highlighted as a unique asset.</li>
          <li><strong>Removal:</strong> Technologies like Flash, Silverlight, or ancient versions of libraries should be pruned from the skills list to keep the resume fresh.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">10. AI and the Future of Resume Writing</h2>

        <h3 className="text-xl font-medium">10.1 Using AI to Write the Resume</h3>
        <p>
          In 2026, using AI tools (like ChatGPT or specialized resume builders) to draft a resume is standard practice, but it comes with risks.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>The "Robotic" Tone:</strong> AI often generates generic, overly flowery language ("passionate visionary," "unwavering commitment"). This reads as inauthentic.</li>
          <li><strong>Best Practice:</strong> Use AI to brainstorm bullet points or to optimize keywords from a job description, but manually edit the output to ensure it sounds human and factually accurate. Use AI as a copy-editor, not a ghostwriter.</li>
        </ul>

        <h3 className="text-xl font-medium">10.2 Listing AI Skills</h3>
        <p>
          Proficiency with AI tools is becoming a "meta-skill" for developers.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Integration:</strong> Showcase how AI tools are used to increase velocity. "Utilized GitHub Copilot to accelerate unit test generation, achieving 90% code coverage in half the estimated time."</li>
          <li><strong>Prompt Engineering:</strong> Understanding how to effectively query LLMs for code generation and debugging is a valid skill to list under "Tools" or "Methodologies".</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">11. Final Review Checklist: The Dos and Don'ts</h2>
        <p>
          Before submission, the resume must undergo a rigorous quality assurance process. The following checklist aggregates the critical "Dos and Don'ts" identified throughout this report.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Component</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">DO</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">DON'T</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Format</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Use a single-column, ATS-friendly layout.</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Use multi-column layouts, graphics, or tables for layout.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">File Type</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Save as PDF with a professional filename.</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Send Word docs or generic filenames (resume.pdf).</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Header</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Link to LinkedIn and GitHub. Use "City, State".</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Include full address or photo (US/UK).</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Summary</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Focus on value, metrics, and core stack.</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Use a generic "Objective" statement.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Skills</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Categorize skills (Frontend, Backend, etc.).</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">List skills alphabetically or include basic literacy (Word).</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Experience</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Use the XYZ formula (Action to Metric to Result).</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">List duties ("Responsible for...") or vague tasks.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Verbs</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Start bullets with strong Power Verbs (Architected, Built).</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Use passive verbs (Helped, Watched, Assisted).</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Projects</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Include a link to a repo with a solid README.</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Link to empty repos or "To-Do List" apps.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Tech</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Tailor keywords to the specific Job Description.</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">List every technology ever used (keyword stuffing).</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Tone</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Be confident, factual, and data-driven.</td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Be humble to a fault or use cliché buzzwords.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Conclusion</h2>
        <p>
          The construction of a professional software developer resume in 2026 is an exercise in engineering a document for two distinct audiences: the algorithm and the human. By adhering to the single-column architecture, aggressively removing non-essential data, and relentlessly quantifying impact through the XYZ formula, a candidate transforms their resume from a mere work history into a compelling business case for their employment. The goal is to minimize friction for the reader and maximize the signal of competence, ensuring that when the six-second scan occurs, the verdict is a decisive "Interview."
        </p>
      </section>
    </div>
  );
};
