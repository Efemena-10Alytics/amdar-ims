import React from "react";
import { MyTools } from "./my-tools";
import { MyEducationBackground } from "./my-education-background";
import { Footer } from "./footer";
import { MySpecialization } from "./my-specializion";
import { MyWorkExperience } from "./my-work-experince";
import { MyProjects } from "./my-project";
import { PortfolioHero } from "./portfolio-hero";

const CreateClassic = () => {
  return (
    <>
      <PortfolioHero
        value={{
          name: "Oluwajuwonlo",
          jobTitle: "Product Designer",
          bio: "Product designer crafting intuitive digital experiences for fintech, enterprise, and social impact. I design with empathy, think systematically, and build solutions that work for everyone. Based in Nigeria, working globally.",
          projectsCount: "28",
          yearsExperience: "3",
          countryName: "Canada",
          toolBadge: "Figma",
        }}
      />
      <MyProjects
        projects={[
          {
            title: "Mango",
            tags: ["Branding", "Graphics"],
            imageUrl: "/images/pngs/template/bold.png",
          },
          {
            title: "IPADPRO",
            tags: ["Website", "Figma", "Hello"],
            imageUrl: "/images/pngs/template/whole.png",
          },
        ]}
        onAddProject={() => {}}
        showAddProject={true}
      />
      <MyWorkExperience
        items={[
          {
            company: "Nigerian Army",
            category: "Security",
            role: "Product Designer",
            duration: "2023-2024",
          },
          {
            company: "Nigerian Army",
            category: "Security",
            role: "Product Designer",
            duration: "2023-2024",
          },
          {
            company: "Nigerian Army",
            category: "Security",
            role: "Product Designer",
            duration: "2023-2024",
          },
        ]}
        onItemClick={() => {}}
      />
      <MySpecialization
        specializations={[
          "Product design",
          "Foundational design",
          "Filers",
          "Architectural",
          "Branding",
          "Graphics",
        ]}
        softSkills={[
          "Prototyping",
          "Interface design",
          "User research",
          "Quantitative research",
          "Qualitative research",
          "Wireframing",
          "Presentations",
          "Slides",
          "Animation",
          "Brain storming",
          "Mood board",
        ]}
      />
      <MyTools
        tools={[
          { name: "Figma", percentage: 80 },
          { name: "Trello", percentage: 80 },
          { name: "Photoshop", percentage: 80 },
          { name: "Adobe Illustrator", percentage: 80 },
        ]}
        title="Product Designer"
      />
      <MyEducationBackground
        entries={[
          { institution: "Salzburg University", degree: "Master's Degree" },
          { institution: "School of Design", degree: "Bachelor's Degree" },
        ]}
      />
      <Footer />
    </>
  );
};

export default CreateClassic;
