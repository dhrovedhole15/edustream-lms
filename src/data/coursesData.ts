export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'development' | 'business' | 'design' | 'marketing' | 'photography' | 'music';
  status: 'published' | 'draft';
  featured: boolean;
  price: number;
  instructorName: string;
  instructorId: string;
  thumbnail: string;
  playlistUrl?: string;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  resources?: { title: string; url: string; type: string }[];
  sections?: {
    id: string;
    title: string;
    description: string;
    lectures: {
      id: string;
      title: string;
      externalLink: string;
      duration: string;
      isPreview: boolean;
      type: string;
    }[];
  }[];
}

export const DEFAULT_COURSES: Course[] = [
  {
    id: "java-dsa-30-days",
    title: "Java to DSA in 30 days",
    description: "A comprehensive 30-day journey from Java basics to advanced Data Structures and Algorithms. Master Arrays, Linked Lists, Trees, Dynamic Programming, and crack top tech product company interviews.",
    category: "development",
    status: "published",
    featured: true,
    price: 0,
    instructorName: "Shradha Khapra & Apna College",
    instructorId: "instructor-apna-college",
    thumbnail: "https://img.youtube.com/vi/yRpLlJmRo2w/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    rating: 4.95,
    reviewsCount: 1540,
    createdAt: "2025-01-01T00:00:00.000Z",
    resources: [
      { title: "Java Programming Digital Notes (PDF Manual)", url: "https://mrcet.com/pdf/Lab%20Manuals/IT/JAVA%20PROGRAMMING.pdf", type: "pdf" },
      { title: "Complete 30-Day DSA Roadmap & Interview Cheat Sheet", url: "https://whimsical.com/dsa-roadmap-by-love-babbar-896vYvJvYvJvYvJvYvJvYv", type: "link" },
      { title: "Official YouTube Playlist Source", url: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop", type: "link" }
    ],
    sections: [
      {
        id: "sec-1",
        title: "Phase 1: Java Fundamentals & Flow Control (Days 1-7)",
        description: "Master Java syntax, JVM architecture, data types, loops, and pattern problems.",
        lectures: [
          { id: "java-dsa-1-1", title: "Day 1: Introduction to Java, JDK Setup & First Program", externalLink: "https://www.youtube.com/watch?v=yRpLlJmRo2w", duration: "15:30", isPreview: true, type: "video" },
          { id: "java-dsa-1-2", title: "Day 2: Variables, Data Types & Input in Java", externalLink: "https://www.youtube.com/watch?v=lusVd5-S2S4", duration: "22:15", isPreview: true, type: "video" },
          { id: "java-dsa-1-3", title: "Day 3: Arithmetic & Logical Operators in Java", externalLink: "https://www.youtube.com/watch?v=O5x3_S8S2vY", duration: "18:40", isPreview: false, type: "video" },
          { id: "java-dsa-1-4", title: "Day 4: Conditional Statements (if-else, switch case)", externalLink: "https://www.youtube.com/watch?v=I5vP9Z_S_S0", duration: "24:10", isPreview: false, type: "video" },
          { id: "java-dsa-1-5", title: "Day 5: Loops in Java (for, while, do-while)", externalLink: "https://www.youtube.com/watch?v=0Z_vS_vS_vS", duration: "28:50", isPreview: false, type: "video" },
          { id: "java-dsa-1-6", title: "Day 6: Star & Number Pattern Questions - Part 1", externalLink: "https://www.youtube.com/watch?v=dr-pLeJ3_S0", duration: "32:00", isPreview: false, type: "video" },
          { id: "java-dsa-1-7", title: "Day 7: Advanced Patterns & Logic Building - Part 2", externalLink: "https://www.youtube.com/watch?v=dr-pLeJ3_S0", duration: "36:45", isPreview: false, type: "video" }
        ]
      },
      {
        id: "sec-2",
        title: "Phase 2: Object Oriented Programming (OOP) in Java (Days 8-14)",
        description: "Deep dive into Classes, Objects, Inheritance, Polymorphism, Abstraction, and Interfaces.",
        lectures: [
          { id: "java-dsa-2-1", title: "Day 8: Functions & Methods with Memory Call Stack", externalLink: "https://www.youtube.com/watch?v=BSVKUk58K6U", duration: "26:20", isPreview: false, type: "video" },
          { id: "java-dsa-2-2", title: "Day 9: Introduction to Classes, Objects & Constructors", externalLink: "https://www.youtube.com/watch?v=BSVKUk58K6U", duration: "29:10", isPreview: false, type: "video" },
          { id: "java-dsa-2-3", title: "Day 10: Inheritance & Polymorphism in Depth", externalLink: "https://www.youtube.com/watch?v=yRpLlJmRo2w", duration: "31:40", isPreview: false, type: "video" },
          { id: "java-dsa-2-4", title: "Day 11: Encapsulation & Access Modifiers in Java", externalLink: "https://www.youtube.com/watch?v=lusVd5-S2S4", duration: "27:15", isPreview: false, type: "video" },
          { id: "java-dsa-2-5", title: "Day 12: Interfaces & Abstract Classes in Java", externalLink: "https://www.youtube.com/watch?v=O5x3_S8S2vY", duration: "25:00", isPreview: false, type: "video" },
          { id: "java-dsa-2-6", title: "Day 13: Packages, Exception Handling & Custom Exceptions", externalLink: "https://www.youtube.com/watch?v=I5vP9Z_S_S0", duration: "33:10", isPreview: false, type: "video" },
          { id: "java-dsa-2-7", title: "Day 14: Java Collections Framework Overview", externalLink: "https://www.youtube.com/watch?v=dr-pLeJ3_S0", duration: "30:00", isPreview: false, type: "video" }
        ]
      },
      {
        id: "sec-3",
        title: "Phase 3: Core Data Structures - Arrays, Strings & Recursion (Days 15-22)",
        description: "Learn Memory layout, 2D Arrays, String pool, Bit manipulation, and Recursion trees.",
        lectures: [
          { id: "java-dsa-3-1", title: "Day 15: 1D Arrays - Creation, Traversal & Linear/Binary Search", externalLink: "https://www.youtube.com/watch?v=yRpLlJmRo2w", duration: "38:00", isPreview: false, type: "video" },
          { id: "java-dsa-3-2", title: "Day 16: 2D Arrays, Matrix Multiplication & Spiral Traversal", externalLink: "https://www.youtube.com/watch?v=lusVd5-S2S4", duration: "35:20", isPreview: false, type: "video" },
          { id: "java-dsa-3-3", title: "Day 17: Strings, StringBuilder & String Constant Pool", externalLink: "https://www.youtube.com/watch?v=O5x3_S8S2vY", duration: "34:15", isPreview: false, type: "video" },
          { id: "java-dsa-3-4", title: "Day 18: Bit Manipulation Tricks for Competitive Coding", externalLink: "https://www.youtube.com/watch?v=I5vP9Z_S_S0", duration: "29:40", isPreview: false, type: "video" },
          { id: "java-dsa-3-5", title: "Day 19: Recursion Level 1 (Factorial, Fibonacci, Print N to 1)", externalLink: "https://www.youtube.com/watch?v=dr-pLeJ3_S0", duration: "42:10", isPreview: false, type: "video" },
          { id: "java-dsa-3-6", title: "Day 20: Recursion Level 2 (Tower of Hanoi, Subsequences)", externalLink: "https://www.youtube.com/watch?v=BSVKUk58K6U", duration: "48:30", isPreview: false, type: "video" },
          { id: "java-dsa-3-7", title: "Day 21: Backtracking Intro - N-Queens & Sudoku Solver", externalLink: "https://www.youtube.com/watch?v=yRpLlJmRo2w", duration: "54:00", isPreview: false, type: "video" },
          { id: "java-dsa-3-8", title: "Day 22: Time & Space Complexity (Big-O Notation)", externalLink: "https://www.youtube.com/watch?v=lusVd5-S2S4", duration: "35:00", isPreview: false, type: "video" }
        ]
      },
      {
        id: "sec-4",
        title: "Phase 4: Advanced DSA, Trees, Graphs & DP (Days 23-30)",
        description: "Master Linked Lists, Stacks, Queues, Binary Trees, BST, Heaps, Hashing, and Dynamic Programming.",
        lectures: [
          { id: "java-dsa-4-1", title: "Day 23: Sorting Algorithms (Bubble, Selection, Insertion, Merge, Quick)", externalLink: "https://www.youtube.com/watch?v=O5x3_S8S2vY", duration: "50:00", isPreview: false, type: "video" },
          { id: "java-dsa-4-2", title: "Day 24: Singly & Doubly Linked Lists with Interview Questions", externalLink: "https://www.youtube.com/watch?v=I5vP9Z_S_S0", duration: "52:15", isPreview: false, type: "video" },
          { id: "java-dsa-4-3", title: "Day 25: Stacks & Queues - Implementation & Monotonic Stack", externalLink: "https://www.youtube.com/watch?v=dr-pLeJ3_S0", duration: "46:40", isPreview: false, type: "video" },
          { id: "java-dsa-4-4", title: "Day 26: Binary Trees (Traversals, Height, Diameter, Views)", externalLink: "https://www.youtube.com/watch?v=BSVKUk58K6U", duration: "58:20", isPreview: false, type: "video" },
          { id: "java-dsa-4-5", title: "Day 27: Binary Search Tree (BST) & Balanced BST", externalLink: "https://www.youtube.com/watch?v=yRpLlJmRo2w", duration: "49:10", isPreview: false, type: "video" },
          { id: "java-dsa-4-6", title: "Day 28: Heaps & Priority Queues (Min-Heap, Max-Heap, Top-K)", externalLink: "https://www.youtube.com/watch?v=lusVd5-S2S4", duration: "47:30", isPreview: false, type: "video" },
          { id: "java-dsa-4-7", title: "Day 29: Hashing, HashMap & HashSet Internal Working", externalLink: "https://www.youtube.com/watch?v=O5x3_S8S2vY", duration: "44:00", isPreview: false, type: "video" },
          { id: "java-dsa-4-8", title: "Day 30: Dynamic Programming (0/1 Knapsack, LCS, LIS) & Next Steps", externalLink: "https://www.youtube.com/watch?v=I5vP9Z_S_S0", duration: "65:00", isPreview: false, type: "video" }
        ]
      }
    ]
  },
  {
    id: "java-interview-prep",
    title: "Most Asked Java Interview Questions",
    description: "Master the top most-asked Java interview questions and coding challenges asked by FAANG, Tier-1, and Product companies. Includes Core Java, JVM internals, OOPs, Collections, Multithreading, Concurrency, and Java 8 Streams.",
    category: "development",
    status: "published",
    featured: true,
    price: 0,
    instructorName: "Java Tech Lead & Senior Architect",
    instructorId: "instructor-java-lead",
    thumbnail: "https://img.youtube.com/vi/4Ib9amXl4gI/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/watch?v=4Ib9amXl4gI",
    rating: 4.92,
    reviewsCount: 2180,
    createdAt: "2025-01-02T00:00:00.000Z",
    resources: [
      { title: "Top 100 Most Asked Java Interview Questions (PDF Cheat Sheet)", url: "https://mrcet.com/pdf/Lab%20Manuals/IT/JAVA%20PROGRAMMING.pdf", type: "pdf" },
      { title: "Java 8 to 21 Features Quick Reference Guide", url: "https://whimsical.com/dsa-roadmap-by-love-babbar-896vYvJvYvJvYvJvYvJvYv", type: "link" }
    ],
    sections: [
      {
        id: "interview-sec-1",
        title: "Section 1: Core Java Fundamentals & JVM Architecture",
        description: "Essential foundational questions on JVM internals, JIT compiler, Garbage Collection, and Memory allocation.",
        lectures: [
          { id: "java-q-1", title: "Q1-Q5: JVM vs JRE vs JDK, ClassLoader & JIT Execution Pipeline", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "18:20", isPreview: true, type: "video" },
          { id: "java-q-2", title: "Q6-Q10: Stack vs Heap Memory, Metaspace & Garbage Collection Algorithms", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "21:45", isPreview: true, type: "video" },
          { id: "java-q-3", title: "Q11-Q15: String Constant Pool, Immutability & String vs StringBuilder vs StringBuffer", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "16:30", isPreview: false, type: "video" },
          { id: "java-q-4", title: "Q16-Q20: Wrapper Classes, Autoboxing/Unboxing Pitfalls & Pass by Value Nuance", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "19:10", isPreview: false, type: "video" }
        ]
      },
      {
        id: "interview-sec-2",
        title: "Section 2: Object-Oriented Programming (OOP) Deep-Dive",
        description: "Real-world scenario questions on Inheritance, Polymorphism, Abstraction, Interfaces, and Solid Principles.",
        lectures: [
          { id: "java-q-5", title: "Q21-Q25: Method Overloading vs Overriding & Covariant Return Types", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "22:15", isPreview: false, type: "video" },
          { id: "java-q-6", title: "Q26-Q30: Abstract Classes vs Interfaces & Java 8 Default/Static Methods", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "25:40", isPreview: false, type: "video" },
          { id: "java-q-7", title: "Q31-Q35: Encapsulation, Access Modifiers, and The Diamond Problem in Java", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "17:50", isPreview: false, type: "video" }
        ]
      }
    ]
  },
  {
    id: "web-dev-bootcamp",
    title: "Full-Stack Web Development Bootcamp (React, Node, Next.js)",
    description: "Learn modern full-stack web development from scratch. Build production-ready web apps with React 19, TypeScript, Node.js, Express, Next.js 15, Tailwind CSS, and cloud databases.",
    category: "development",
    status: "published",
    featured: true,
    price: 49.99,
    instructorName: "Sarah Jenkins, Principal Engineer",
    instructorId: "instructor-sarah",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    rating: 4.88,
    reviewsCount: 840,
    createdAt: "2025-01-03T00:00:00.000Z",
    resources: [
      { title: "Full-Stack Developer Architecture Blueprint", url: "https://mrcet.com/pdf/Lab%20Manuals/IT/JAVA%20PROGRAMMING.pdf", type: "pdf" }
    ],
    sections: [
      {
        id: "web-sec-1",
        title: "Module 1: Modern Frontend Architecture (React & TypeScript)",
        description: "Hooks, state machines, component performance, and clean UI design systems.",
        lectures: [
          { id: "web-1", title: "1. Advanced React Hooks & State Management Patterns", externalLink: "https://www.youtube.com/watch?v=yRpLlJmRo2w", duration: "25:00", isPreview: true, type: "video" },
          { id: "web-2", title: "2. Building Scalable TypeScript Applications", externalLink: "https://www.youtube.com/watch?v=lusVd5-S2S4", duration: "30:00", isPreview: false, type: "video" }
        ]
      }
    ]
  },
  {
    id: "ui-ux-masterclass",
    title: "UI/UX Design Masterclass: Figma to High-Fidelity Prototypes",
    description: "Master modern user interface and user experience design. Learn design systems, typography hierarchy, auto-layout, wireframing, interactive prototyping, and developer handoff.",
    category: "design",
    status: "published",
    featured: true,
    price: 39.99,
    instructorName: "Elena Rostova",
    instructorId: "instructor-elena",
    thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60",
    rating: 4.90,
    reviewsCount: 620,
    createdAt: "2025-01-04T00:00:00.000Z",
    resources: [],
    sections: [
      {
        id: "design-sec-1",
        title: "Module 1: Figma Foundations & Design Systems",
        description: "Color theory, typographic scale, and auto-layout mastery.",
        lectures: [
          { id: "des-1", title: "1. Visual Hierarchy & Spatial Grid Systems", externalLink: "https://www.youtube.com/watch?v=yRpLlJmRo2w", duration: "20:00", isPreview: true, type: "video" }
        ]
      }
    ]
  },
  {
    id: "product-management-agile",
    title: "Product Management & Agile Scrum Leadership",
    description: "Learn how to define product vision, conduct user discovery, build roadmaps, run agile sprints, and lead cross-functional engineering teams.",
    category: "business",
    status: "published",
    featured: false,
    price: 59.99,
    instructorName: "Marcus Vance, VP of Product",
    instructorId: "instructor-marcus",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    rating: 4.82,
    reviewsCount: 410,
    createdAt: "2025-01-05T00:00:00.000Z",
    resources: [],
    sections: [
      {
        id: "biz-sec-1",
        title: "Module 1: Product Strategy & User Discovery",
        description: "Customer interviews, value proposition design, and roadmapping.",
        lectures: [
          { id: "biz-1", title: "1. Market Opportunity Analysis & Product Roadmaps", externalLink: "https://www.youtube.com/watch?v=yRpLlJmRo2w", duration: "22:00", isPreview: true, type: "video" }
        ]
      }
    ]
  }
];
