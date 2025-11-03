import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Brain,
  Video,
  LineChart,
  Trophy,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  PlayCircle,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Navigation Bar */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartInterview
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onGetStarted}>
              Sign In
            </Button>
            <Button onClick={onGetStarted} size="lg">
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-1.5 text-sm bg-blue-100 text-blue-700 border-blue-200">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Interview Practice
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Master Your Interview Skills
            </span>
            <br />
            <span className="text-gray-900">with Real-Time AI Feedback</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Practice with intelligent questions, get instant feedback on your
            answers, body language, and confidence. Land your dream job with
            confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="px-8 py-6 text-lg h-auto shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Practicing Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={onGetStarted}
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg h-auto border-2"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">10K+</span>
              <span>Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-900">95%</span>
              <span>Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">4.9/5</span>
              <span>Average Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Everything You Need to Ace Your Interview
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you perform at your best
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              AI-Powered Questions
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Practice with intelligent questions tailored to your job role,
              experience level, and interview type. Get questions that match
              real-world scenarios.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Video className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Real-Time Video Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced gesture and posture tracking analyzes your body language,
              eye contact, and facial expressions in real-time as you practice.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LineChart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Detailed Analytics
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Track your progress over time with comprehensive metrics on
              speech, confidence, and performance. See exactly where you're
              improving.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200 group">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Gamification
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Compete on leaderboards, earn points, and unlock achievements as
              you improve your interview skills. Make practice fun and engaging.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200 group">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Privacy First
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your data is encrypted and secure. Choose to store only metrics or
              full recordings based on your preference. Full control over your
              data.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-yellow-200 group">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Instant Feedback
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get actionable insights and improvement tips immediately after
              each practice session. Know exactly what to work on next.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in minutes and start improving immediately
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                num: 1,
                title: "Sign Up",
                desc: "Create your profile and set your interview goals in seconds",
              },
              {
                num: 2,
                title: "Configure",
                desc: "Choose job role, difficulty, and interview type",
              },
              {
                num: 3,
                title: "Practice",
                desc: "Answer AI questions with video and audio recording",
              },
              {
                num: 4,
                title: "Improve",
                desc: "Review feedback and track your progress over time",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg">
                  {step.num}
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">
                  {step.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Loved by Job Seekers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our users are saying about their interview success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Sarah Chen",
              role: "Software Engineer",
              company: "Google",
              content:
                "SmartInterview helped me land my dream job at Google. The real-time feedback was incredibly valuable.",
              rating: 5,
            },
            {
              name: "Michael Rodriguez",
              role: "Product Manager",
              company: "Meta",
              content:
                "The AI questions were spot-on for my product management interview. I felt so much more confident.",
              rating: 5,
            },
            {
              name: "Emily Johnson",
              role: "Data Scientist",
              company: "Amazon",
              content:
                "The body language analysis was eye-opening. I improved my posture and eye contact significantly.",
              rating: 5,
            },
          ].map((testimonial, idx) => (
            <Card key={idx} className="p-6 border-2">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-600">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl my-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Join thousands of job seekers who are already improving their
            interview skills. Start your free practice session today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 text-blue-100">
              <CheckCircle2 className="w-5 h-5" />
              <span>Free to get started</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <CheckCircle2 className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <CheckCircle2 className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="px-10 py-7 text-lg h-auto bg-white text-blue-600 hover:bg-gray-100 shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              SmartInterview
            </span>
          </div>
          <p className="text-sm text-gray-600">
            © 2024 SmartInterview. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Simple Sparkles icon component since it's not in lucide-react
const Sparkles = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);
