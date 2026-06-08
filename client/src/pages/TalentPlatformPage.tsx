import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Users, DollarSign, Star, MapPin, Clock } from "lucide-react";

export default function TalentPlatformPage() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [searchQuery, setSearchQuery] = useState("");

  const mockJobs = [
    {
      id: "job_1",
      title: "Full Stack Developer",
      description: "Build scalable web applications",
      budget: 5000,
      timeline: "2-4 weeks",
      skills: ["React", "Node.js", "PostgreSQL"],
      proposals: 12,
      rating: 4.8,
    },
    {
      id: "job_2",
      title: "UI/UX Designer",
      description: "Design modern interfaces",
      budget: 3000,
      timeline: "1-2 weeks",
      skills: ["Figma", "Design Systems", "Prototyping"],
      proposals: 8,
      rating: 4.9,
    },
    {
      id: "job_3",
      title: "Mobile App Developer",
      description: "iOS/Android development",
      budget: 7000,
      timeline: "4-6 weeks",
      skills: ["React Native", "Swift", "Kotlin"],
      proposals: 15,
      rating: 4.7,
    },
  ];

  const mockFreelancers = [
    {
      id: "freelancer_1",
      name: "Alex Chen",
      title: "Senior Full Stack Developer",
      hourlyRate: 85,
      rating: 4.9,
      completedJobs: 127,
      skills: ["React", "Node.js", "AWS", "Docker"],
      avatar: "👨‍💻",
    },
    {
      id: "freelancer_2",
      name: "Sarah Williams",
      title: "Product Designer",
      hourlyRate: 75,
      rating: 4.8,
      completedJobs: 89,
      skills: ["Figma", "Prototyping", "UX Research"],
      avatar: "👩‍🎨",
    },
    {
      id: "freelancer_3",
      name: "Marcus Johnson",
      title: "DevOps Engineer",
      hourlyRate: 95,
      rating: 4.9,
      completedJobs: 156,
      skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
      avatar: "👨‍💼",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Talent Platform</h1>
          <p className="text-slate-400">Connect with top freelancers and find amazing projects</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Search jobs or freelancers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 h-12"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800 border-b border-slate-700 mb-8">
            <TabsTrigger value="jobs" className="text-slate-300 data-[state=active]:text-cyan-400">
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs ({mockJobs.length})
            </TabsTrigger>
            <TabsTrigger value="freelancers" className="text-slate-300 data-[state=active]:text-cyan-400">
              <Users className="w-4 h-4 mr-2" />
              Freelancers ({mockFreelancers.length})
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {mockJobs.map((job) => (
              <Card key={job.id} className="bg-slate-800/50 border-slate-700 p-6 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{job.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">${job.budget}</p>
                    <p className="text-slate-400 text-sm">Fixed Price</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.timeline}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.proposals} proposals
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {job.rating}
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  View Job & Submit Proposal
                </Button>
              </Card>
            ))}
          </TabsContent>

          {/* Freelancers Tab */}
          <TabsContent value="freelancers" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="bg-slate-800/50 border-slate-700 p-6 hover:border-slate-600 transition-colors">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{freelancer.avatar}</div>
                  <h3 className="text-xl font-bold text-white">{freelancer.name}</h3>
                  <p className="text-slate-400 text-sm">{freelancer.title}</p>
                </div>

                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hourly Rate</span>
                    <span className="text-cyan-400 font-bold">${freelancer.hourlyRate}/hr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-bold">{freelancer.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Completed Jobs</span>
                    <span className="text-white font-bold">{freelancer.completedJobs}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-slate-400 text-xs mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {freelancer.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  View Profile & Hire
                </Button>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Jobs</p>
                <p className="text-3xl font-bold text-white">2,847</p>
              </div>
              <Briefcase className="w-10 h-10 text-cyan-500" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Top Freelancers</p>
                <p className="text-3xl font-bold text-white">12.5K</p>
              </div>
              <Users className="w-10 h-10 text-green-500" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Paid</p>
                <p className="text-3xl font-bold text-white">$45M</p>
              </div>
              <DollarSign className="w-10 h-10 text-yellow-500" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Rating</p>
                <p className="text-3xl font-bold text-white">4.8/5</p>
              </div>
              <Star className="w-10 h-10 text-yellow-500" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
