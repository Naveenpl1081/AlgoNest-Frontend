
import React, { useState, useEffect } from 'react';
import { Code, Users, Briefcase, ChevronRight, Star, ArrowRight, Menu, X, Play, Check, MessageCircle, Zap,Trophy, UserPlus, Building2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const AlgoNestLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Coding Challenges",
      description: "Master algorithms with industry-level challenges designed to make you think like a pro",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Job Portal",
      description: "Discover exclusive job opportunities from top tech companies and apply directly",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Developer Community",
      description: "Connect with fellow developers, share knowledge, and solve problems together",
      color: "from-pink-400 to-purple-400"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Developers" },
    { number: "500+", label: "Companies" },
    { number: "1,000+", label: "Job Openings" },
    { number: "50,000+", label: "Problems Solved" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Meta",
      content: "AlgoNest helped me land my dream job! The coding challenges are exactly what you face in real interviews.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0e1?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Alex Rodriguez",
      role: "Full Stack Developer",
      content: "The community aspect is incredible. I've learned so much from other developers and made great connections.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Priya Sharma",
      role: "Backend Engineer at Google",
      content: "Found my current job through AlgoNest's job portal. The interview process was smooth and professional.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setShowSignupModal(true);
    setTimeout(() => setIsModalAnimating(true), 10);
  };

  const handleCloseModal = () => {
    setIsModalAnimating(false);
    setTimeout(() => setShowSignupModal(false), 300);
  };

  const handleSignupChoice = (type:string) => {
    setIsModalAnimating(false);
    setTimeout(() => {
      setShowSignupModal(false);
      if (type === 'user') {
        navigate('/user/login');
      } else if (type === 'recruiter') {
        navigate('/recruiter/login');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
     
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>


      {showSignupModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          isModalAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
        }`}>
          <div className={`bg-slate-800 rounded-2xl p-8 border border-slate-600/50 max-w-md w-full mx-4 relative transition-all duration-300 transform ${
            isModalAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Choose Your Path
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={() => handleSignupChoice('user')}
                className="w-full p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 group hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-white">Join as Developer</h4>
                    <p className="text-sm text-gray-300">Practice coding, find jobs, connect with community</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </button>
              
              <button
                onClick={() => handleSignupChoice('recruiter')}
                className="w-full p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 group hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-white">Join as Recruiter</h4>
                    <p className="text-sm text-gray-300">Find talented developers, post jobs, manage hiring</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AlgoNest
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'Community', 'Jobs', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
           

            <button 
              onClick={handleGetStarted} 
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700/50">
            <div className="px-6 py-4 space-y-4">
              {['Features', 'Community', 'Jobs', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-gray-300 hover:text-white">
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-700/50">
               
                <button 
                  onClick={handleGetStarted}
                  className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-slate-700/50 rounded-full border border-slate-600/50 mb-6">
                <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm">Your Next-Level Coding Platform</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Master Code.
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Land Jobs.
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Build Community.
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Enhance your programming skills with industry-level challenges, explore exclusive job opportunities, 
                and connect with a vibrant community of developers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center"
                >
                  Start Coding
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-slate-700/50 backdrop-blur-md rounded-xl font-semibold text-lg border border-slate-600/50 hover:bg-slate-600/50 transition-all duration-200 flex items-center justify-center">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-slate-900"></div>
                    ))}
                  </div>
                  <span>10,000+ developers</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-slate-700/30 backdrop-blur-md rounded-3xl p-8 border border-slate-600/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-400">challenge.js</span>
                  </div>
                  
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-purple-300">function <span className="text-blue-300">twoSum</span>(<span className="text-gray-300">nums, target</span>) </div>
                    <div className="pl-4 text-gray-300">const map = new Map();</div>
                    <div className="pl-4 text-gray-300">for (let i = 0; i &lt; nums.length; i++) </div>
                    <div className="pl-8 text-gray-300">const complement = target - nums[i];</div>
                    <div className="pl-8 text-green-300">if (map.has(complement)) </div>
                    <div className="pl-12 text-yellow-300">return [map.get(complement), i];</div>
                    <div className="pl-8 text-green-300"></div>
                    <div className="pl-8 text-gray-300">map.set(nums[i], i);</div>
                    <div className="pl-4 text-gray-300"></div>
                    <div className="text-purple-300"></div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Tests Passed: 15/15</span>
                    </div>
                    <div className="text-sm text-blue-400">Runtime: 68ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From coding challenges to job opportunities and community support - all in one platform
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-700/30 backdrop-blur-md rounded-2xl p-8 border border-slate-600/50 relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Portal Section */}
      <section id="jobs" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-600/20 rounded-full border border-purple-500/30 mb-6">
                <Briefcase className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-sm text-purple-300">Job Portal</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Land Your Dream Job
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Connect directly with top tech companies. Browse exclusive job openings, 
                apply with one click, and get noticed by hiring managers.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Direct applications to 500+ companies",
                  "Personalized job recommendations", 
                  "Interview scheduling and tracking",
                  "Salary insights and negotiations"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { company: "Google", role: "Senior Frontend Developer", salary: "$180k - $220k", logo: "🟢" },
                { company: "Meta", role: "Full Stack Engineer", salary: "$160k - $200k", logo: "🔵" },
                { company: "Netflix", role: "Backend Developer", salary: "$170k - $210k", logo: "🔴" }
              ].map((job, index) => (
                <div
                  key={index}
                  className="bg-slate-700/50 backdrop-blur-md rounded-xl p-6 border border-slate-600/50 cursor-pointer hover:scale-103 hover:translate-x-2 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl mr-4">
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{job.role}</h3>
                        <p className="text-gray-400">{job.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{job.salary}</p>
                      <p className="text-xs text-gray-400">Posted 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-md">Remote</span>
                      <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-md">Full-time</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { user: "Sarah", question: "How to optimize this recursive function?", replies: 12, time: "2 min ago" },
                { user: "Alex", question: "Best practices for React state management?", replies: 8, time: "5 min ago" },
                { user: "Priya", question: "Help with binary tree traversal algorithm", replies: 15, time: "10 min ago" }
              ].map((post, index) => (
                <div
                  key={index}
                  className="bg-slate-700/30 backdrop-blur-md rounded-xl p-6 border border-slate-600/50 hover:scale-102 hover:translate-x-2 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center font-semibold">
                      {post.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-white">{post.user}</span>
                        <span className="text-xs text-gray-400">{post.time}</span>
                      </div>
                      <p className="text-gray-300 mb-3">{post.question}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.replies} replies
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full border border-blue-500/30 mb-6">
                <Users className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-sm text-blue-300">Community</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Learn Together
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join a vibrant community of developers. Ask questions, share knowledge, 
                and grow together. Get help when you're stuck and help others when you can.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "24/7 community support",
                  "Expert mentors and code reviews", 
                  "Discussion forums and study groups",
                  "Knowledge sharing and networking"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                What Developers Say
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-700/30 backdrop-blur-md rounded-2xl p-8 border border-slate-600/50 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-3xl p-12 border border-slate-600/50">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ready to Level Up?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of developers who are already advancing their careers with AlgoNest
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center"
              >
                Start Your Journey
                <Trophy className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                AlgoNest
              </div>
              <p className="text-gray-400 leading-relaxed">
                The ultimate platform for developers to master coding, find jobs, and build community.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Coding Challenges</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Job Portal</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Community</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Learning Paths</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">API Docs</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 AlgoNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AlgoNestLanding;