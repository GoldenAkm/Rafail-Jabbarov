export const profile = {
  name: "Rafail Jabbarov",
  handle: "R.JABBAROV",
  role: "Computer Engineering Student",
  school: "University of Victoria",
  degree: "BEng, Computer Engineering",
  graduation: "May 2028",
  location: "Victoria, BC",
  email: "jabbarovrafail@gmail.com",
  github: "https://github.com/GoldenAkm",
  githubHandle: "GoldenAkm",
  linkedin: "https://www.linkedin.com/in/rafail-jabbarov/",
  resume: "/resume.pdf",
  tagline:
    "I design circuit boards, write the firmware that runs on them, and automate the systems around them.",
  bio: [
    "I'm a Computer Engineering student at the University of Victoria, past my second year and focused on embedded systems, digital design and signal processing.",
    "Before engineering school took over, I spent two years running Linux and AWS infrastructure for the university, which taught me to automate the boring parts and keep systems up.",
  ],
  coursework: [
    "Advanced Digital Systems",
    "Embedded Systems",
    "Digital Signal Processing",
    "Data Structures",
  ],
};

export type SkillGroup = {
  id: string;
  label: string;
  items: { name: string; level: number }[];
};

// level: 1–5, rendered as a segmented readout
export const skills: SkillGroup[] = [
  {
    id: "HW",
    label: "Hardware",
    items: [
      { name: "KiCad / PCB design", level: 4 },
      { name: "Oscilloscopes", level: 4 },
      { name: "Soldering", level: 4 },
      { name: "Power supplies & bench test", level: 3 },
    ],
  },
  {
    id: "SW",
    label: "Software",
    items: [
      { name: "Python", level: 5 },
      { name: "C / C++", level: 4 },
      { name: "MicroPython", level: 4 },
      { name: "SQL", level: 3 },
      { name: "Bash", level: 4 },
    ],
  },
  {
    id: "OPS",
    label: "Systems",
    items: [
      { name: "Linux administration", level: 4 },
      { name: "AWS hosting", level: 3 },
      { name: "Technical documentation", level: 5 },
      { name: "Excel / data analysis", level: 4 },
    ],
  },
];

export type Project = {
  code: string;
  title: string;
  date: string;
  stack: string[];
  summary: string;
  points: string[];
  link?: string;
};

export const projects: Project[] = [
  {
    code: "PRJ-0726",
    title: "Embedded Systems Prototype",
    date: "Jul 2026",
    stack: ["MicroPython", "KiCad", "Raspberry Pi Pico W"],
    summary:
      "A custom embedded audio and display system on a PCB I designed from scratch.",
    points: [
      "Designed a two-layer 100 × 60 mm PCB in KiCad, with wiring diagrams and drawings.",
      "Integrated a Raspberry Pi Pico W, analog audio amplifiers and digital displays.",
      "Wrote a 30-page design report covering architecture, test parameters and schematics.",
    ],
  },
  {
    code: "PRJ-0426",
    title: "Automated Test Log Parser",
    date: "Apr 2026",
    stack: ["Python", "SQL", "Excel"],
    summary:
      "Turns massive raw execution logs into structured defect data.",
    points: [
      "Built a Python parser that extracts structured records from raw system logs.",
      "Organized and analyzed defect-resolution data with SQL and Excel.",
      "Reported milestone progress for project tracking.",
    ],
  },
  {
    code: "PRJ-0326",
    title: "DSP & Hardware Validation",
    date: "Mar 2026",
    stack: ["Python", "Oscilloscopes", "Signal processing"],
    summary:
      "Finding and filtering signal degradation in real hardware.",
    points: [
      "Measured high-speed clock signals on lab oscilloscopes to isolate degradation.",
      "Built Python statistical models to filter physical anomalies from sensor data.",
      "Followed a structured electrical validation method.",
    ],
  },
  {
    code: "PRJ-0723",
    title: "Spring Boot Login App",
    date: "Jul 2023",
    stack: ["Java", "Spring Boot", "JPA", "HTML/CSS"],
    summary: "An MVC web app with a login flow and admin panel.",
    points: [
      "Login form backed by Spring Data JPA with credential validation.",
      "Redirects to an admin panel on success, inline errors on failure.",
    ],
    link: "https://github.com/GoldenAkm/user-service-mvc",
  },
];

export type Role = {
  title: string;
  org: string;
  place: string;
  period: string;
  points: string[];
};

export const experience: Role[] = [
  {
    title: "System Administrator",
    org: "University of Victoria",
    place: "Victoria, BC",
    period: "Aug 2023 – Aug 2025",
    points: [
      "Automated server resource allocation and data entry with Python and Bash.",
      "Ran Linux-based AWS hosting for large events at 99.9% uptime.",
      "Coordinated infrastructure improvements with teams across the university.",
    ],
  },
  {
    title: "Help Desk Support Analyst",
    org: "Network Training Centre",
    place: "Baku, Azerbaijan",
    period: "May 2023 – Aug 2023",
    points: [
      "Troubleshot hardware failures and network issues directly with users.",
      "Documented procedures to speed up future incident response.",
    ],
  },
];
