import React from 'react';
import Hero from '../components/Hero';
import CourseGrid from '../components/CourseGrid';
import { SkillsGraph } from '../components/marketing/SkillsGraph';
import { SocialProof } from '../components/marketing/SocialProof';
import { FAQSection } from '../components/marketing/FAQSection';
import { ContactSuggestionSection } from '../components/marketing/ContactSuggestionSection';

const Home = () => {
  return (
    <main className="bg-[#05070a] min-h-screen transition-colors">
      <Hero />
      <CourseGrid />
      <SkillsGraph />
      <SocialProof />
      <FAQSection />
      <ContactSuggestionSection />
    </main>
  );
};

export default Home;
