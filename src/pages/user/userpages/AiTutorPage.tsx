import React from 'react';
import { Brain, Sparkles, MessageSquare, Code, Lightbulb, ArrowRight, Zap, BookOpen, Target } from 'lucide-react';
import UserLayout from '../../../layouts/UserLayout';

const AiTutorPage = () => {
  const handleTryAiTutor = () => {
    window.location.href = '/user/ai-chat';
  };

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Assistance",
      description: "Get help understanding complex algorithms and data structures with step-by-step explanations"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Logic Building",
      description: "Learn problem-solving approaches and develop strong logical thinking for coding challenges"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "24/7 Available",
      description: "Ask questions anytime and get instant, personalized responses tailored to your learning pace"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Concept Clarity",
      description: "Deep dive into programming concepts with examples, analogies, and practical applications"
    }
  ];

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Introducing AI-Powered Learning</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Meet Your Personal
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Coding Tutor
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Struggling with how to approach a problem? Confused about logic building or coding concepts? 
            Our advanced AI tutor is here to guide you through every challenge, providing personalized 
            explanations and helping you become a better programmer.
          </p>

          <button
            onClick={handleTryAiTutor}
            className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/50 inline-flex items-center space-x-2"
          >
            <Brain className="w-5 h-5" />
            <span>Start Learning with AI Tutor</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-700/40 border border-slate-600/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-blue-500/20 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ask Your Question</h3>
              <p className="text-gray-300 text-sm">Type any coding doubt, problem approach, or concept you need help with</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get AI Guidance</h3>
              <p className="text-gray-300 text-sm">Receive detailed explanations, hints, and step-by-step solutions instantly</p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/30">
                <span className="text-2xl font-bold text-pink-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Master the Concept</h3>
              <p className="text-gray-300 text-sm">Learn at your own pace and build strong problem-solving skills</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative z-10">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Accelerate Your Learning?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of students who are improving their coding skills with personalized AI assistance. 
              No question is too small, no concept too complex.
            </p>
            <button
              onClick={handleTryAiTutor}
              className="group bg-white hover:bg-gray-100 text-slate-900 font-semibold py-3 px-8 rounded-xl transition-all duration-300 inline-flex items-center space-x-2 shadow-lg"
            >
              <BookOpen className="w-5 h-5" />
              <span>Try AI Tutor Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AiTutorPage;