import { FaCertificate, FaClock, FaVideo } from "react-icons/fa";

export default function WhyChoose() {
  const cards = [
    {
      title: "Interactive Courses",
      description: "Engage with high-quality videos, quizzes, and assignments that help you apply what you learn.",
      icon: <FaVideo className="text-5xl text-blue-700 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />,
    },
    {
      title: "Verified Certificates",
      description: "Earn recognized certificates to showcase your new skills and boost your resume.",
      icon: <FaCertificate className="text-5xl text-blue-700 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />,
    },
    {
      title: "Learn Anytime",
      description: "Access your courses anytime, anywhere — perfect for busy professionals.",
      icon: <FaClock className="text-5xl text-blue-700 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />,
    },
  ];

  return (
    <section
      id="why-choose"
      className="relative h-screen snap-start snap-always flex flex-col justify-center py-16 md:py-32 px-6 overflow-hidden"
      // Enhanced your original Black to Gray gradient with a radial spotlight
      style={{
        background: 'radial-gradient(circle at center, #1f2937 0%, #111827 50%, #000000 100%)'
      }}
    >
      {/* Premium Gradient Effect Overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-700/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold text-[#FAF9F6] mb-6 tracking-tight">
          Why Choose <span className="text-blue-500">LA Lead Academy?</span>
        </h2>
        <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
          Thousands of learners love LA Lead Academy because it offers quality content,
          skilled mentors, and practical learning tools to boost your teachings.
        </p>

        {/* Cards Container */}
        <div className="flex flex-wrap justify-center gap-6">
          {cards.map((card) => (
            <Card
              key={card.title}
              title={card.title}
              description={card.description}
            >
              {card.icon}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Improved Card with subtle border-glow and your Sky-Blue color
const Card = ({ title, description, children }) => (
  <div 
    className="group p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 w-full max-w-xs flex flex-col items-center bg-[#e0f2fe] border border-blue-200/50 shadow-md hover:shadow-xl"
  >
    {/* Icon Area */}
    <div className="mb-4">
      {children}
    </div>
    
    <h4 className="font-bold text-xl text-gray-900 mb-3 tracking-tight">
      {title}
    </h4>
    
    <p className="text-gray-600 text-sm leading-relaxed text-center px-2">
      {description}
    </p>

    {/* Simple, static accent line */}
  </div>
);