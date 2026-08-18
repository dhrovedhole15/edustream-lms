import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Stripe from "stripe";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf8"));

// Initialize Firebase Admin
const adminApp = getApps().length ? getApps()[0] : initializeApp({
  projectId: firebaseConfig.projectId,
});

const firestore = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(adminApp, firebaseConfig.firestoreDatabaseId) 
  : getFirestore(adminApp);

// Function to auto-seed LMS Courses in Firestore
async function seedAllCoursesData() {
  try {
    // 1. JAVA TO DSA IN 30 DAYS Course
    const javaDsaPayload = {
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
      createdAt: new Date().toISOString(),
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
    };

    // Check by title
    const existingDsa = await firestore.collection('courses')
      .where('title', 'in', ['Java to DSA in 30 days', 'JAVA TO DSA IN 30 DAYS'])
      .limit(1)
      .get();

    if (existingDsa.empty) {
      await firestore.collection('courses').add(javaDsaPayload);
      console.log("Seeded 'Java to DSA in 30 days' course to Firestore");
    } else {
      const existingId = existingDsa.docs[0].id;
      await firestore.collection('courses').doc(existingId).update({
        ...javaDsaPayload,
        price: 0,
        status: "published",
        featured: true,
      });
      console.log("Updated 'Java to DSA in 30 days' course in Firestore (ID: " + existingId + ")");
    }

    // 2. MOST ASKED JAVA INTERVIEW QUESTIONS Course
    const javaInterviewPayload = {
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
      createdAt: new Date().toISOString(),
      resources: [
        { title: "Top 100 Most Asked Java Interview Questions (PDF Cheat Sheet)", url: "https://mrcet.com/pdf/Lab%20Manuals/IT/JAVA%20PROGRAMMING.pdf", type: "pdf" },
        { title: "Java 8 to 21 Features Quick Reference Guide", url: "https://whimsical.com/dsa-roadmap-by-love-babbar-896vYvJvYvJvYvJvYvJvYv", type: "link" },
        { title: "Full Masterclass Video Source", url: "https://www.youtube.com/watch?v=4Ib9amXl4gI", type: "link" }
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
            { id: "java-q-7", title: "Q31-Q35: Encapsulation, Access Modifiers, and The Diamond Problem in Java", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "17:50", isPreview: false, type: "video" },
            { id: "java-q-8", title: "Q36-Q40: Static Methods, Static Variables, and Static Initializer Blocks", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "20:30", isPreview: false, type: "video" }
          ]
        },
        {
          id: "interview-sec-3",
          title: "Section 3: Java Collections Framework & Generics",
          description: "In-depth questions on HashMap internal hashing, collision resolution, and thread-safety.",
          lectures: [
            { id: "java-q-9", title: "Q41-Q45: Internal Working of HashMap (Put/Get, Treeify Threshold & Hash Collision)", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "28:10", isPreview: false, type: "video" },
            { id: "java-q-10", title: "Q46-Q50: ArrayList vs LinkedList vs Vector & Fail-Fast vs Fail-Safe Iterators", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "24:00", isPreview: false, type: "video" },
            { id: "java-q-11", title: "Q51-Q55: HashSet vs TreeSet, equals() & hashCode() Contract in Practice", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "26:30", isPreview: false, type: "video" },
            { id: "java-q-12", title: "Q56-Q60: ConcurrentHashMap, CopyOnWriteArrayList & Synchronized Collections", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "23:15", isPreview: false, type: "video" }
          ]
        },
        {
          id: "interview-sec-4",
          title: "Section 4: Multithreading, Concurrency & Exception Handling",
          description: "Thread synchronization, deadlock prevention, ExecutorService, and exception hierarchies.",
          lectures: [
            { id: "java-q-13", title: "Q61-Q65: Thread Lifecycle, Thread vs Runnable vs Callable & Future API", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "27:45", isPreview: false, type: "video" },
            { id: "java-q-14", title: "Q66-Q70: Synchronized, Volatile Keyword, AtomicInteger & Deadlock Resolution", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "31:20", isPreview: false, type: "video" },
            { id: "java-q-15", title: "Q71-Q75: ThreadPoolExecutor, Fixed vs Cached ThreadPools & ForkJoinPool", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "25:00", isPreview: false, type: "video" },
            { id: "java-q-16", title: "Q76-Q80: Checked vs Unchecked Exceptions, try-with-resources & Custom Exceptions", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "22:30", isPreview: false, type: "video" }
          ]
        },
        {
          id: "interview-sec-5",
          title: "Section 5: Java 8+ Streams, Lambdas & Live Coding Challenges",
          description: "Functional programming patterns in modern Java, Streams API, and live interview coding solutions.",
          lectures: [
            { id: "java-q-17", title: "Q81-Q85: Lambda Expressions, Functional Interfaces & Method References", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "26:15", isPreview: false, type: "video" },
            { id: "java-q-18", title: "Q86-Q90: Java 8 Stream API Operations (filter, map, flatMap, reduce, collectors)", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "34:40", isPreview: false, type: "video" },
            { id: "java-q-19", title: "Q91-Q95: Optional Class, CompletableFuture & Java 17/21 Records & Pattern Matching", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "29:50", isPreview: false, type: "video" },
            { id: "java-q-20", title: "Q96-Q100: Top 10 Live Java Coding Interview Challenges with Code Walkthrough", externalLink: "https://www.youtube.com/watch?v=4Ib9amXl4gI", duration: "45:00", isPreview: false, type: "video" }
          ]
        }
      ]
    };

    const existingInterview = await firestore.collection('courses')
      .where('title', 'in', ['Most Asked Java Interview Questions', 'Most Asked Java Questions', 'most asked java questions'])
      .limit(1)
      .get();

    if (existingInterview.empty) {
      await firestore.collection('courses').add(javaInterviewPayload);
      console.log("Seeded 'Most Asked Java Interview Questions' course to Firestore");
    } else {
      const existingId = existingInterview.docs[0].id;
      await firestore.collection('courses').doc(existingId).update({
        ...javaInterviewPayload,
        price: 0,
        status: "published",
        featured: true,
      });
      console.log("Updated 'Most Asked Java Interview Questions' course in Firestore (ID: " + existingId + ")");
    }

    // 3. FULL STACK WEB DEVELOPMENT Course
    const webDevPayload = {
      title: "Full-Stack Web Development Bootcamp (React, Node, Next.js)",
      description: "Learn modern full-stack web development from scratch. Build production-ready web apps with React 19, TypeScript, Node.js, Express, Next.js 15, Tailwind CSS, and cloud databases.",
      category: "development",
      status: "published",
      featured: true,
      price: 49.99,
      instructorName: "Sarah Jenkins, Principal Engineer",
      instructorId: "instructor-sarah-jenkins",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
      rating: 4.88,
      reviewsCount: 840,
      createdAt: new Date().toISOString(),
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
    };

    const existingWebDev = await firestore.collection('courses')
      .where('title', '==', webDevPayload.title)
      .limit(1)
      .get();
    if (existingWebDev.empty) {
      await firestore.collection('courses').add(webDevPayload);
    }

    // 4. UI/UX Design Course
    const designPayload = {
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
      createdAt: new Date().toISOString(),
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
    };

    const existingDesign = await firestore.collection('courses')
      .where('title', '==', designPayload.title)
      .limit(1)
      .get();
    if (existingDesign.empty) {
      await firestore.collection('courses').add(designPayload);
    }

    // 5. Business & Agile Management Course
    const businessPayload = {
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
      createdAt: new Date().toISOString(),
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
    };

    const existingBiz = await firestore.collection('courses')
      .where('title', '==', businessPayload.title)
      .limit(1)
      .get();
    if (existingBiz.empty) {
      await firestore.collection('courses').add(businessPayload);
    }

  } catch (err) {
    console.error("Error auto-seeding LMS courses:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auto seed courses on server boot
  await seedAllCoursesData();

  // Stripe setup (Lazy initialization)
  let stripe: Stripe | null = null;
  const getStripe = () => {
    if (!stripe && process.env.STRIPE_SECRET_KEY) {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get All Published Courses
  app.get("/api/courses", async (req, res) => {
    try {
      const snapshot = await firestore.collection("courses").get();
      let courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If database is empty or needs seeding, seed immediately
      if (courses.length === 0) {
        await seedAllCoursesData();
        const retrySnapshot = await firestore.collection("courses").get();
        courses = retrySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      res.json(courses);
    } catch (error: any) {
      console.error("Error fetching courses from firestore, returning seeded courses:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get Single Course by ID
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const doc = await firestore.collection("courses").doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Seed All Courses Endpoint
  app.post("/api/seed/all-courses", async (req, res) => {
    try {
      await seedAllCoursesData();
      res.json({ success: true, message: "All LMS courses seeded successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/seed/java-dsa", async (req, res) => {
    try {
      await seedAllCoursesData();
      res.json({ success: true, message: "Course seeded" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Free Enrollment
  app.post("/api/enroll/free", async (req, res) => {
    const { courseId, userId } = req.body;
    try {
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      let enrolledCourses: string[] = [];
      if (userDoc.exists) {
        const userData = userDoc.data();
        enrolledCourses = userData?.enrolledCourses || [];
        if (!enrolledCourses.includes(courseId)) {
          await userRef.update({
            enrolledCourses: [...enrolledCourses, courseId]
          });
        }
      } else {
        await userRef.set({
          uid: userId,
          enrolledCourses: [courseId],
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      // Add enrollment record
      const existingEnroll = await firestore.collection('enrollments')
        .where('courseId', '==', courseId)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (existingEnroll.empty) {
        await firestore.collection('enrollments').add({
          courseId,
          userId,
          enrolledAt: new Date().toISOString(),
          status: 'active'
        });
      }

      // Create or update initial progress record
      const progressSnap = await firestore.collection('progress')
        .where('courseId', '==', courseId)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (progressSnap.empty) {
        await firestore.collection('progress').add({
          userId,
          courseId,
          completedLectures: [],
          progressPercentage: 0,
          lastAccessed: new Date().toISOString()
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Free enroll error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    const { courseId, courseTitle, price, userId } = req.body;
    const stripeClient = getStripe();

    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: courseTitle,
              },
              unit_amount: Math.round(price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL}/success?courseId=${courseId}`,
        cancel_url: `${process.env.APP_URL}/cancel`,
        metadata: {
          courseId,
          userId,
        },
      });

      res.json({ id: session.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // LMS API Routes

  // GET /courses/:id/content - Get course content (sections/lectures)
  app.get("/api/courses/:id/content", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

    try {
      // 1. Try finding in Firestore by ID
      let courseData: any = null;
      let courseDoc = await firestore.collection("courses").doc(id).get();
      if (courseDoc.exists) {
        courseData = courseDoc.data();
      } else {
        // Search by slug or title in seeded courses
        const snap = await firestore.collection("courses").get();
        for (const d of snap.docs) {
          const data = d.data();
          if (d.id === id || data.title?.toLowerCase().includes(id.toLowerCase()) || id.toLowerCase().includes(d.id.toLowerCase())) {
            courseData = data;
            break;
          }
        }
      }

      if (!courseData) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({
        sections: courseData?.sections || [],
        resources: courseData?.resources || [],
        title: courseData?.title,
      });
    } catch (error: any) {
      console.error("Course content fetch error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /progress/update - Update overall progress
  app.post("/api/progress/update", async (req, res) => {
    const { userId, courseId, progressPercentage, completedLectures } = req.body;

    try {
      const progressQuery = await firestore
        .collection("progress")
        .where("userId", "==", userId)
        .where("courseId", "==", courseId)
        .limit(1)
        .get();

      let progressDoc;
      if (progressQuery.empty) {
        progressDoc = firestore.collection("progress").doc();
        await progressDoc.set({
          userId,
          courseId,
          progressPercentage,
          completedLectures,
          lastAccessedAt: new Date().toISOString(),
        });
      } else {
        progressDoc = progressQuery.docs[0].ref;
        await progressDoc.update({
          progressPercentage,
          completedLectures,
          lastAccessedAt: new Date().toISOString(),
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /progress/:courseId - Get student progress for a course
  app.get("/api/progress/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const { userId } = req.query;

    try {
      const progressQuery = await firestore
        .collection("progress")
        .where("userId", "==", userId)
        .where("courseId", "==", courseId)
        .limit(1)
        .get();

      if (progressQuery.empty) {
        return res.json({
          progressPercentage: 0,
          completedLectures: [],
        });
      }

      res.json(progressQuery.docs[0].data());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /lecture/complete - Mark a lecture as complete
  app.post("/api/lecture/complete", async (req, res) => {
    const { userId, courseId, lectureId } = req.body;

    try {
      const progressQuery = await firestore
        .collection("progress")
        .where("userId", "==", userId)
        .where("courseId", "==", courseId)
        .limit(1)
        .get();

      let progressDoc;
      let completedLectures = [];
      let progressPercentage = 0;

      // Get course to calculate percentage
      const courseDoc = await firestore.collection("courses").doc(courseId).get();
      const courseData = courseDoc.data();
      const totalLectures = courseData?.sections?.reduce((acc: number, section: any) => acc + (section.lectures?.length || 0), 0) || 1;

      if (progressQuery.empty) {
        progressDoc = firestore.collection("progress").doc();
        completedLectures = [lectureId];
        progressPercentage = (1 / totalLectures) * 100;
        await progressDoc.set({
          userId,
          courseId,
          completedLectures,
          progressPercentage,
          lastAccessedAt: new Date().toISOString(),
        });
      } else {
        progressDoc = progressQuery.docs[0].ref;
        const data = progressQuery.docs[0].data();
        completedLectures = data.completedLectures || [];
        if (!completedLectures.includes(lectureId)) {
          completedLectures.push(lectureId);
        }
        progressPercentage = (completedLectures.length / totalLectures) * 100;
        await progressDoc.update({
          completedLectures,
          progressPercentage,
          lastAccessedAt: new Date().toISOString(),
        });
      }

      res.json({ success: true, progressPercentage, completedLectures });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
