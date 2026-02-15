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

export default function Home() {
  return (
    <section>
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <HeadTag title="LA Lead Academy" />
      <Banner />
      <TrustedClients />
      <WhyChoose />
      <PopularCourses />
      <NewCourses /> 
      <Feedback /> 
      <PlatformStats />
      {/* <JoinAsTeacher /> */}
      <CallToAction /></div>
    </section>
  );
} 
