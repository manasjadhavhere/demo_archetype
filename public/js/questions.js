// Assessment questions with weighted scoring - 5 most impactful questions
const questions = [
    {
        id: 1,
        emoji: "🎯",
        question: "How do you approach a complex business challenge?",
        options: [
            {
                text: "📊 Analyze data thoroughly and create a comprehensive strategic plan",
                weights: { architect: 3, commander: 1, pioneer: 0, catalyst: 0 }
            },
            {
                text: "⚡ Rally the team quickly and execute with speed",
                weights: { architect: 0, commander: 3, pioneer: 1, catalyst: 1 }
            },
            {
                text: "💡 Brainstorm innovative solutions and experiment with new approaches",
                weights: { architect: 0, commander: 0, pioneer: 3, catalyst: 1 }
            },
            {
                text: "🤝 Understand team perspectives and build consensus for collective action",
                weights: { architect: 0, commander: 1, pioneer: 0, catalyst: 3 }
            }
        ]
    },
    {
        id: 2,
        emoji: "⚡",
        question: "What energizes you most in your professional role?",
        options: [
            {
                text: "🏛️ Developing long-term strategies and seeing the big picture",
                weights: { architect: 3, commander: 0, pioneer: 1, catalyst: 0 }
            },
            {
                text: "🎯 Hitting targets and achieving measurable results",
                weights: { architect: 1, commander: 3, pioneer: 0, catalyst: 0 }
            },
            {
                text: "🚀 Creating something new and disrupting the status quo",
                weights: { architect: 0, commander: 0, pioneer: 3, catalyst: 1 }
            },
            {
                text: "💫 Developing people and watching them grow",
                weights: { architect: 0, commander: 0, pioneer: 1, catalyst: 3 }
            }
        ]
    },
    {
        id: 3,
        emoji: "🎓",
        question: "What describes your career aspiration best?",
        options: [
            {
                text: "👔 Reaching C-suite and shaping organizational strategy",
                weights: { architect: 3, commander: 1, pioneer: 0, catalyst: 0 }
            },
            {
                text: "⚙️ Running operations at scale and optimizing performance",
                weights: { architect: 1, commander: 3, pioneer: 0, catalyst: 0 }
            },
            {
                text: "🔮 Leading innovation and driving digital transformation",
                weights: { architect: 0, commander: 0, pioneer: 3, catalyst: 1 }
            },
            {
                text: "🌟 Building high-performing teams and shaping culture",
                weights: { architect: 0, commander: 1, pioneer: 0, catalyst: 3 }
            }
        ]
    },
    {
        id: 4,
        emoji: "🔑",
        question: "When making important decisions, you typically:",
        options: [
            {
                text: "📈 Rely on data, research, and analytical frameworks",
                weights: { architect: 3, commander: 1, pioneer: 0, catalyst: 0 }
            },
            {
                text: "⏱️ Trust your experience and move quickly to implementation",
                weights: { architect: 0, commander: 3, pioneer: 1, catalyst: 0 }
            },
            {
                text: "🎲 Explore unconventional options and take calculated risks",
                weights: { architect: 0, commander: 0, pioneer: 3, catalyst: 1 }
            },
            {
                text: "👥 Consult with stakeholders and consider the human impact",
                weights: { architect: 0, commander: 0, pioneer: 0, catalyst: 3 }
            }
        ]
    },
    {
        id: 5,
        emoji: "💼",
        question: "What skill gap do you feel most limits your growth?",
        options: [
            {
                text: "🌍 Need deeper strategic frameworks and global business perspective",
                weights: { architect: 3, commander: 1, pioneer: 0, catalyst: 0 }
            },
            {
                text: "⚖️ Need to balance operational excellence with strategic thinking",
                weights: { architect: 1, commander: 3, pioneer: 0, catalyst: 0 }
            },
            {
                text: "🔬 Need to scale innovation and build sustainable business models",
                weights: { architect: 1, commander: 0, pioneer: 3, catalyst: 0 }
            },
            {
                text: "🧠 Need frameworks for organizational behavior and change management",
                weights: { architect: 0, commander: 1, pioneer: 1, catalyst: 3 }
            }
        ]
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = questions;
}
