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

export default function Home() {
  return (
    <section>
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
      <CallToAction /></div>
    </section>
  );
} 
