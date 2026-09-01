export interface Quote {
  id: string;
  quote: string;
  author: string;
  category: "EDUCATION" | "LEADERSHIP" | "CURIOSITY" | "INSPIRATION";
}

export const EDUCATIONAL_QUOTES: Quote[] = [
  {
    id: "q1",
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    category: "EDUCATION",
  },
  {
    id: "q2",
    quote: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
    category: "CURIOSITY",
  },
  {
    id: "q3",
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    category: "INSPIRATION",
  },
  {
    id: "q4",
    quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    category: "EDUCATION",
  },
  {
    id: "q5",
    quote: "Leadership and learning are indispensable to each other.",
    author: "John F. Kennedy",
    category: "LEADERSHIP",
  },
  {
    id: "q6",
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    category: "INSPIRATION",
  },
  {
    id: "q7",
    quote: "Intelligence plus character - that is the goal of true education.",
    author: "Martin Luther King Jr.",
    category: "EDUCATION",
  },
];

export function getRandomQuote(): Quote {
  const index = Math.floor(Math.random() * EDUCATIONAL_QUOTES.length);
  return EDUCATIONAL_QUOTES[index];
}
