import HeadTag from "../components/common/HeadTag";
import Banner from "../components/home/Banner";
import CallToAction from "../components/home/CallToAction";
import Feedback from "../components/home/Feedback";
import JoinAsTeacher from "../components/home/JoinAsTeacher";
import NewCourses from "../components/home/NewCourses";
import PlatformStats from "../components/home/PlatformStats";
import PopularCourses from "../components/home/PopularCourses";
import TrustedClients from "../components/home/TrustedClients";
import WhyChoose from "../components/home/WhyChoose";
import WhatSchoolsAchieve from "../components/home/WhatSchoolsAchieve";
import GlobalTrustSection from "../components/home/GlobalTrustSection";
import FounderSection from "../components/home/FounderSection";
import { useState } from "react";

export default function Home() {
  const [hideNav, setHideNav] = useState(false);

  return (
    <section className="relative">
      {/* 1. We apply the style globally here */}
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar-container { 
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
          transform: ${hideNav ? 'translateY(-100%)' : 'translateY(0)'} !important;
        }
      `}} />

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
        <HeadTag title="LA Lead Academy" />
        <Banner />
        <TrustedClients />
        <PopularCourses />
        <WhatSchoolsAchieve/>
        <GlobalTrustSection />
        <FounderSection />
      {/* <WhyChoose /> */}
      
      {/* <NewCourses /> 
      <Feedback /> 
      <PlatformStats /> */}
      {/* <JoinAsTeacher /> */}
      <CallToAction onVisible={setHideNav} /> </div>
    </section>
  );
} 
