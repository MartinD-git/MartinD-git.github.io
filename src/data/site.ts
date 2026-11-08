export const site = {
  name: "Martin Daigne",
  position: "AI Research Intern",
  description: "Martin Daigne — AI research, robotics, machine learning, and control. Selected projects and engineering work.",
  introduction: "Hi! Welcome to my website. This is a place where I centralize my projects and resume.",
  biography:
    "With a mechanical engineering background, I’m pursuing a master’s in robotics and a data science minor at EPFL. Recent projects span adaptive soft-arm control and diffusion policies for drones.",
  philosophy: `I’m interested in how advances in AI and machine learning can make robots more capable, adaptive, and useful.

My interests lie in exploring how to use the recent (massive) advancements in AI to improve robots. Here are some really cool blogs I can only recommend: [Lil’Log](https://lilianweng.github.io/) and [Karpathy’s](https://karpathy.github.io/).

Don’t hesitate to look at my GitHub profile for the code of some of the projects.`,

  // Intentional content date. Update this when you edit website content.
  updated: "2026-11-01",
  note: "",
  github: "https://github.com/MartinD-git",
  linkedin: "https://www.linkedin.com/in/martin-daigne-04ba40250/",
  cv: "/assets/rendercv/rendercv_output/Martin_Daigne_CV.pdf",
  footerLinks: [] as { label: string; url: string }[],
};

// Stable IDs are stored in projects. Labels and order can change independently.
export const categories = [
  { id: "machine-learning", label: "Machine Learning" },
  { id: "mechanical", label: "Mechanical" },
  { id: "robotics", label: "Robotics" },
];
