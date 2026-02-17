// AI Specialization Data - No Course Suggestions
const specializations = {
    genai: {
        title: "Generative AI Specialist",
        icon: "🎨",
        color: "#8B5CF6",
        
        strengths: [
            "Creative thinking and content ideation",
            "Understanding of language and communication",
            "Interest in cutting-edge AI applications",
            "Ability to work with AI tools and APIs"
        ],
        
        improvements: [
            "Deep understanding of transformer architectures",
            "Advanced prompt engineering techniques",
            "Fine-tuning and customizing LLMs",
            "Building production-ready Gen AI applications"
        ],
        
        story: "You have a natural affinity for creative applications of AI! Your interest in content generation, language models, and creative AI tools shows you're perfect for the Generative AI track. This field is revolutionizing content creation, marketing, and human-computer interaction."
    },
    
    agentic: {
        title: "Agentic AI Specialist",
        icon: "🤖",
        color: "#3B82F6",
        
        strengths: [
            "Strong programming and algorithmic thinking",
            "Interest in autonomous systems",
            "Problem-solving and system design skills",
            "Understanding of complex workflows"
        ],
        
        improvements: [
            "Multi-agent system architectures",
            "Reinforcement learning techniques",
            "Agent coordination and communication",
            "Building scalable AI agent platforms"
        ],
        
        story: "You're a perfect candidate for Agentic AI! Your technical mindset and interest in autonomous systems show you have what it takes to build the future of intelligent agents. This is the cutting edge of AI - systems that can plan, reason, and act independently."
    },
    
    applied: {
        title: "Applied AI Specialist",
        icon: "📊",
        color: "#10B981",
        
        strengths: [
            "Data analysis and interpretation skills",
            "Business problem-solving mindset",
            "Understanding of statistics and ML basics",
            "Focus on practical, real-world applications"
        ],
        
        improvements: [
            "Advanced machine learning algorithms",
            "Production ML deployment and monitoring",
            "Feature engineering and model optimization",
            "Building end-to-end ML pipelines"
        ],
        
        story: "Applied AI is your sweet spot! Your analytical mindset and focus on solving real business problems make you ideal for this track. This field is about taking AI from theory to practice - building models that drive actual business value."
    },
    
    mixed: {
        title: "AI Generalist",
        icon: "🌟",
        color: "#F59E0B",
        
        strengths: [
            "Broad interest across AI domains",
            "Adaptable and quick learner",
            "Holistic understanding of technology",
            "Versatile problem-solving approach"
        ],
        
        improvements: [
            "Choosing a specialization based on career goals",
            "Deep diving into specific AI technologies",
            "Building expertise in one core area",
            "Developing a focused AI skill set"
        ],
        
        story: "You're an AI explorer with interests across multiple domains! Your broad curiosity is a strength. You have the potential to excel in any AI field - whether it's creative Gen AI, autonomous Agentic systems, or practical Applied AI solutions."
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { specializations };
}

