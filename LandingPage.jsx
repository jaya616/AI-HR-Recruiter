import React, { useState } from 'react';
import { Mic, Brain, BarChart3, Globe, Zap, Shield, Users, TrendingUp, CheckCircle, Star, Award, MessageSquare, Clock, Play, ArrowRight, Sparkles, Target, Database, Volume2 } from 'lucide-react';
 import AIRecruiterDemo from './AIRecruiterDemo';

const LandingPage = () => {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: Mic,
      title: "Voice-Powered Interviews",
      description: "Natural conversation flow with advanced speech recognition and text-to-speech in multiple languages and accents",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Brain,
      title: "AI-Driven Analysis",
      description: "Intelligent scoring system evaluates technical accuracy, communication skills, and cultural fit automatically",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Database,
      title: "300+ Questions Database",
      description: "Comprehensive question bank covering 25+ job roles across tech, business, and creative fields",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Get comprehensive reports with category breakdowns, strengths, and improvement areas",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Conduct interviews in English (US, UK, AU, IN), Spanish, French, German, Japanese, Korean, and more",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Instant feedback and dynamic conversation flow adapts to candidate responses",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { icon: Users, value: "25+", label: "Job Roles" },
    { icon: MessageSquare, value: "300+", label: "Questions" },
    { icon: Globe, value: "10+", label: "Languages" },
    { icon: Award, value: "5+", label: "Score Categories" }
  ];

  const jobRoles = [
    "Python Developer", "Data Scientist", "Machine Learning Engineer", "Web Developer",
    "Java Developer", "DevOps Engineer", "UI/UX Designer", "Product Manager",
    "Marketing Executive", "Sales Executive", "HR Executive", "Project Manager",
    "Business Analyst", "QA Engineer", "Cloud Engineer", "Network Engineer",
    "Financial Analyst", "SEO Specialist", "Social Media Manager", "Blockchain Developer",
    "AI Researcher", "Content Writer", "Graphic Designer", "Customer Support",
    "Operations Manager"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "HR Director, TechCorp",
      content: "This AI recruiter has transformed our hiring process. We've reduced interview time by 60% while maintaining quality.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Startup Founder",
      content: "The voice interface makes it feel natural, and the detailed analytics help us make data-driven hiring decisions.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Talent Acquisition Lead",
      content: "Multi-language support is a game-changer. We can now efficiently interview candidates from around the globe.",
      rating: 5
    }
  ];

if (showDemo) {
  return (
    <div className="relative min-h-screen">
      <button
        onClick={() => setShowDemo(false)}
        className="absolute top-6 left-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
      >
        ← Back to Landing Page
      </button>
      <AIRecruiterDemo />
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-pink-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Powered by Advanced AI Technology</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              AI Voice Agent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                Hirebot360
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Revolutionize your hiring process with intelligent voice interviews. 
              Conduct professional assessments in multiple languages with real-time AI analysis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowDemo(true)}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-purple-500/50 flex items-center gap-3 transform hover:scale-105"
              >
                <Play className="w-6 h-6" />
                Start Interview Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">
                <Volume2 className="w-6 h-6" />
                Watch Demo Video
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all">
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400">Everything you need for modern recruitment</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Job Roles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            25+ Job Roles Covered
          </h2>
          <p className="text-xl text-gray-400">Comprehensive question database across multiple domains</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
          <div className="flex flex-wrap gap-3 justify-center">
            {jobRoles.map((role, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-white font-medium border border-purple-400/30 hover:border-purple-400 transition-all hover:scale-105 cursor-default"
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400">Simple, fast, and effective</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: Target, title: "Configure", desc: "Set candidate details, job role, language, and difficulty level" },
            { icon: Mic, title: "Interview", desc: "AI conducts voice interview with natural conversation flow" },
            { icon: Brain, title: "Analyze", desc: "Advanced AI evaluates responses across multiple categories" },
            { icon: BarChart3, title: "Report", desc: "Get detailed analytics and hiring recommendations" }
          ].map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/50">
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 hidden md:block" style={{ transform: 'translateX(50%)' }}></div>
              <h3 className="text-2xl font-bold text-white mb-3">Step {index + 1}</h3>
              <h4 className="text-xl font-semibold text-purple-400 mb-2">{step.title}</h4>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What People Say
          </h2>
          <p className="text-xl text-gray-400">Trusted by hiring teams worldwide</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
              <div>
                <div className="font-bold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies using AI-powered voice interviews to find the best talent faster.
          </p>
          <button
            onClick={() => setShowDemo(true)}
            className="group px-10 py-5 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            Try It Now - It's Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-400">
            <p className="mb-2">© 2025 AI Recruiter Voice Agent. All rights reserved.</p>
            <p className="text-sm">Powered by Advanced AI & Machine Learning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;