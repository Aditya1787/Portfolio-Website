import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  lovely,
  up,
  homeease,
  currencyconvert,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Algorithm Specialist",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "B.Tech in Computer Science and Engineering",
    icon: lovely,
    iconBg: "#E6DEDD",
    date: "August 2023 - August 2027",
    points: [],
  },
  {
    title: "Intermediate (Class 12) - Uttar Pradesh Board",
    icon: up,
    iconBg: "#E6DEDD",
    date: "April 2021 - March 2023",
    points: [],

  },
  {
    title: "High School (Class 10) - Uttar Pradesh Board",
    icon: up,
    iconBg: "#E6DEDD",
    date: "April 2019 - March 2021",
    points: [],

  },
];



const projects = [
  {
  name: "Home-Ease",
  description:
    "A web-based platform that connects users with verified home service professionals, enabling them to browse, schedule, and manage essential services like cleaning, plumbing, and electrical repairs — all from a single, convenient dashboard.",
  tags: [
    {
      name: "react",
      color: "blue-text-gradient",
    },
    {
      name: "mongodb",
      color: "green-text-gradient",
    },
    {
      name: "tailwind",
      color: "pink-text-gradient",
    },
  ],
  image: homeease,
  source_code_link: "https://github.com/rajsingh73/Home-service-Booking",
},
{
  name: "Currency Convert",
  description:
    "A modern web application that helps users convert global currencies instantly using real-time exchange rates. It offers a clean, responsive interface for accurate conversions and effortless comparison of multiple currencies worldwide.",
  tags: [
    {
      name: "react",
      color: "blue-text-gradient",
    },
    {
      name: "api",
      color: "green-text-gradient",
    },
    {
      name: "tailwind",
      color: "pink-text-gradient",
    },
  ],
  image: currencyconvert,
  source_code_link: "https://github.com/rajsingh73/React/tree/main/currency_converter",
}

];

export { services, technologies, experiences, projects };