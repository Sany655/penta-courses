import React from 'react';
import Hero from '../components/Hero';
import CourseGrid from '../components/CourseGrid';
import { SkillsGraph } from '../components/marketing/SkillsGraph';
import { SocialProof } from '../components/marketing/SocialProof';

const Home = () => {
  return (
    <main className="bg-[#05070a] min-h-screen">
      <Hero />
      <CourseGrid />
      <SkillsGraph />
      <SocialProof />
    </main>
  );
};

export default Home;
