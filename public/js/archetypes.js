// Archetype data structure with definitions and program mappings
const archetypes = {
  architect: {
    title: "Strategic Architect",
    icon: "🏛️",
    strength: "You possess strong vision and decision-making ability, combined with analytical thinking that helps you see the bigger picture.",
    gap: "To reach the next level, you need advanced strategic frameworks and a global business perspective to drive transformation at scale.",
    unlockPath: "Executive MBA / DBA in Strategic Management",
    programs: [
      {
        name: "Executive MBA",
        benefit: "Master strategic leadership frameworks for C-suite roles",
        cta: "Book Career Call",
        link: "#"
      },
      {
        name: "DBA in Business Strategy",
        benefit: "Drive organizational transformation with research-backed insights",
        cta: "Book Career Call",
        link: "#"
      }
    ]
  },
  commander: {
    title: "Operational Commander",
    icon: "⚡",
    strength: "You excel at execution and getting things done. Your ability to manage complex operations and drive results is your superpower.",
    gap: "To scale your impact, you need to develop strategic thinking and learn to balance operational excellence with long-term vision.",
    unlockPath: "Executive Program in Operations & Supply Chain",
    programs: [
      {
        name: "Executive Program in Operations",
        benefit: "Optimize processes and lead operational transformation",
        cta: "Book Career Call",
        link: "#"
      },
      {
        name: "MBA in Operations Management",
        benefit: "Build end-to-end operational leadership capabilities",
        cta: "Book Career Call",
        link: "#"
      }
    ]
  },
  pioneer: {
    title: "Innovation Pioneer",
    icon: "🚀",
    strength: "You're a creative problem solver who thrives on innovation and disruption. Your ability to think differently sets you apart.",
    gap: "To maximize your impact, you need to learn how to scale innovation, manage change, and build business models around new ideas.",
    unlockPath: "Executive Program in Innovation & Entrepreneurship",
    programs: [
      {
        name: "Executive Program in Innovation",
        benefit: "Learn to systematize innovation and lead digital transformation",
        cta: "Book Career Call",
        link: "#"
      },
      {
        name: "MBA in Technology Management",
        benefit: "Bridge technology and business to drive innovation",
        cta: "Book Career Call",
        link: "#"
      }
    ]
  },
  catalyst: {
    title: "People Catalyst",
    icon: "🤝",
    strength: "You're a natural team builder and mentor. Your ability to inspire, develop, and lead people is your greatest asset.",
    gap: "To elevate your leadership, you need frameworks for organizational behavior, change management, and building high-performance cultures.",
    unlockPath: "Executive Program in Leadership & HR Management",
    programs: [
      {
        name: "Executive Program in Leadership",
        benefit: "Master the art of leading teams and driving cultural change",
        cta: "Book Career Call",
        link: "#"
      },
      {
        name: "MBA in HR & Organizational Behavior",
        benefit: "Build expertise in talent strategy and people leadership",
        cta: "Book Career Call",
        link: "#"
      }
    ]
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = archetypes;
}
