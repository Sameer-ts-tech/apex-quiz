import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/models/User";
import { GraduationCap, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight">Apex Quiz</span>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8">
          The Intelligent <span className="text-blue-600">Quiz Platform</span><br />
          for Modern Coaching
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Empower your students with advanced testing analytics.
          Create, manage, and analyze performance with our powerful AI-driven tools.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <Button size="lg" className="h-14 px-8 text-lg">
              Start Teaching <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
