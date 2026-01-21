import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/models/User";
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Users,
  BarChart3,
  Zap,
  CheckCircle2,
  Brain,
  Target,
  Sparkles,
  Search,
  Trophy,
  Rocket
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    switch (session.user.role) {
      case UserRole.SUPER_ADMIN:
        redirect('/super-admin');
      case UserRole.COACH:
        redirect('/coach');
      case UserRole.STUDENT:
        redirect('/student');
      default:
        redirect('/login');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Apex Quiz
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-500/25">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center px-4 py-2 mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full">
          <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
          <span className="text-sm text-gray-300">Trusted by 10,000+ Students & 500+ Coaches</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          <span className="text-white">Master Every Exam with </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Intelligent Testing
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          The ultimate platform for learners and educators. Access premium quizzes,
          track progress with deep analytics, and master subjects with real-time feedback.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-500/25 group">
              Start Practicing Now
              <Rocket className="ml-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white">
              For Coaching Centers
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-gray-800">
          {[
            { value: "10K+", label: "Mastering Exams" },
            { value: "500+", label: "Coaching Partners" },
            { value: "50K+", label: "Quizzes Available" },
            { value: "99%", label: "Platform Uptime" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Audience Section - Dual Focus */}
      <section className="relative z-10 py-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* For Students */}
            <div className="p-8 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-3xl">
              <div className="w-12 h-12 mb-6 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Students</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Take control of your learning. Access a global marketplace of quizzes,
                get instant results with math processing, and track your performance history
                to identify weak spots and improve scores.
              </p>
              <ul className="space-y-3 mb-8">
                {["Access Global Marketplace", "Instant Performance Analysis", "Support for Math & Images", "Detailed Progress History"].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-blue-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full bg-blue-600 hover:bg-blue-500">Find Your Next Quiz</Button>
              </Link>
            </div>

            {/* For Coaches */}
            <div className="p-8 bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 rounded-3xl">
              <div className="w-12 h-12 mb-6 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Coaching Centers</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Scale your teaching. Build massive question banks, generate random tests
                instantly, and automate student management. Use our white-label-ready
                platform to power your institute.
              </p>
              <ul className="space-y-3 mb-8">
                {["Smart Random Generators", "Student Performance Tracking", "Bulk Question Management", "Revenue Share Model"].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-purple-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full bg-purple-600 hover:bg-purple-500">Sign Up as Coach</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Marketplace Preview */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="text-left mb-8 md:mb-0">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Global Explorer <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Marketplace</span>
              </h2>
              <p className="text-xl text-gray-400">
                Discover quizzes from top coaching centers around the world.
              </p>
            </div>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-400/10">
                View All Quizzes <Search className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Advanced Mathematics", questions: 50, center: "Elite Coaching", price: "Free" },
              { title: "Physics Mock Test", questions: 30, center: "Science Hub", price: "Premium" },
              { title: "Reasoning Challenge", questions: 25, center: "IQS Academy", price: "Free" },
            ].map((mock, i) => (
              <div key={i} className="p-6 bg-slate-950/50 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${mock.price === 'Free' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {mock.price}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{mock.title}</h4>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>{mock.questions} Questions</span>
                  <span>•</span>
                  <span>{mock.center}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Dual Path */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-16">
            Your Journey to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Success</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="text-left">
              <h3 className="text-xl font-bold text-blue-400 mb-8 flex items-center">
                <Trophy className="mr-2 h-5 w-5" /> FOR STUDENTS
              </h3>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Join Apex", desc: "Sign up and build your personality profile." },
                  { step: "02", title: "Find Quizzes", desc: "Browse the marketplace or join your coach's class." },
                  { step: "03", title: "Level Up", desc: "Take tests and analyze results to master your subjects." }
                ].map((s, i) => (
                  <div key={i} className="flex items-start">
                    <div className="text-2xl font-bold text-slate-800 mr-6 mt-1">{s.step}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{s.title}</h4>
                      <p className="text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-left">
              <h3 className="text-xl font-bold text-purple-400 mb-8 flex items-center">
                <Users className="mr-2 h-5 w-5" /> FOR COACHES
              </h3>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Register Instittue", desc: "Setup your coaching portal in seconds." },
                  { step: "02", title: "Create Content", desc: "Add questions & categories with rich media." },
                  { step: "03", title: "Manage Scale", desc: "Activate quizzes & monitor hundreds of student results." }
                ].map((s, i) => (
                  <div key={i} className="flex items-start">
                    <div className="text-2xl font-bold text-slate-800 mr-6 mt-1">{s.step}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{s.title}</h4>
                      <p className="text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Why Learners and Coaches
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Choose Us</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                A unified ecosystem designed for peak academic performance and operational efficiency.
              </p>
              <ul className="space-y-4">
                {[
                  "Rich media support: Math equations and images",
                  "Detailed attempt analysis for deep insights",
                  "Automated grading and instant student feedback",
                  "Global quiz reach for independent coaches",
                  "Secure, fast, and 99% uptime guaranteed"
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-gray-800 rounded-3xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-white font-semibold">Performance Insights</div>
                    <div className="text-gray-500 text-sm">Real-time Student Analytics</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-gray-800">
                    <div className="text-gray-500 text-sm mb-1">Global Rank</div>
                    <div className="text-2xl font-bold text-white">#42</div>
                  </div>
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-gray-800">
                    <div className="text-gray-500 text-sm mb-1">Avg Score</div>
                    <div className="text-2xl font-bold text-blue-400">84%</div>
                  </div>
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-gray-800">
                    <div className="text-gray-500 text-sm mb-1">Quizzes Done</div>
                    <div className="text-2xl font-bold text-white">12</div>
                  </div>
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-gray-800">
                    <div className="text-gray-500 text-sm mb-1">Subject Mastery</div>
                    <div className="text-2xl font-bold text-green-400">Math</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Join the future of academic excellence
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you're a student seeking knowledge or a coach building an empire,
              Apex Quiz has everything you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-500/25 group">
                  Sign Up as Student
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-lg bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-lg shadow-purple-500/25 group">
                  Sign Up as Coach
                </Button>
              </Link>
            </div>
            <p className="text-gray-500 mt-6 text-sm">Free to get started • Instant account setup</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Apex Quiz</span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Apex Quiz. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
