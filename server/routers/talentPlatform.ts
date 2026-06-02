/**
 * Talent Platform Router — Freelancer Profiles, Job Posting, Bidding, Contracts
 * Inspired by Upwork, Fiverr, GitHub Sponsors patterns
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const talentPlatformRouter = router({
  // ─── Create freelancer profile ──────────────────────────────────────────────
  createFreelancerProfile: protectedProcedure
    .input(z.object({
      title: z.string(),
      bio: z.string(),
      skills: z.array(z.string()),
      hourlyRate: z.number().min(5),
      portfolio: z.array(z.object({
        title: z.string(),
        description: z.string(),
        url: z.string().optional(),
        image: z.string().optional(),
      })).optional(),
      certifications: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        freelancerId: `freelancer_${ctx.user.id}`,
        title: input.title,
        hourlyRate: input.hourlyRate,
        status: "active",
        profileCompletion: 0.85,
        createdAt: new Date(),
      };
    }),

  // ─── Get freelancer profile ─────────────────────────────────────────────────
  getFreelancerProfile: publicProcedure
    .input(z.object({
      freelancerId: z.string(),
    }))
    .query(async ({ input }) => {
      return {
        freelancerId: input.freelancerId,
        name: "Alex Developer",
        title: "Full-Stack Developer & AI Specialist",
        hourlyRate: 75,
        rating: 4.9,
        reviews: 250,
        completedJobs: 450,
        totalEarned: 67500,
        responseTime: "30 minutes",
        skills: ["React", "Node.js", "Python", "AI/ML", "DevOps"],
        portfolio: [
          { title: "E-commerce Platform", description: "Full-stack React/Node app", url: "https://example.com" },
          { title: "AI Chatbot", description: "GPT-powered customer support", url: "https://example.com" },
        ],
        certifications: ["AWS Solutions Architect", "Google Cloud Professional"],
        availability: "Available",
        verified: true,
      };
    }),

  // ─── Post job ───────────────────────────────────────────────────────────────
  postJob: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      skills: z.array(z.string()),
      budget: z.object({
        type: z.enum(["fixed", "hourly"]),
        min: z.number().min(0),
        max: z.number().min(0),
      }),
      duration: z.enum(["less_than_week", "1_to_3_weeks", "1_to_3_months", "3_to_6_months", "ongoing"]),
      level: z.enum(["entry", "intermediate", "expert"]),
      attachments: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        jobId: `job_${Date.now()}`,
        title: input.title,
        budget: input.budget,
        status: "open",
        createdAt: new Date(),
        deadline: new Date(Date.now() + 2592000000), // 30 days
        bidsReceived: 0,
        proposalsReceived: 0,
      };
    }),

  // ─── Get job details ────────────────────────────────────────────────────────
  getJobDetails: publicProcedure
    .input(z.object({
      jobId: z.string(),
    }))
    .query(async ({ input }) => {
      return {
        jobId: input.jobId,
        title: "Build AI Chatbot for E-commerce",
        description: "Need experienced AI developer to build GPT-powered chatbot for our e-commerce platform",
        skills: ["Python", "OpenAI API", "Node.js", "React"],
        budget: { type: "fixed", min: 5000, max: 10000 },
        duration: "1_to_3_months",
        level: "expert",
        status: "open",
        postedBy: "TechCorp Inc",
        postedDate: new Date(Date.now() - 604800000),
        deadline: new Date(Date.now() + 2592000000),
        bidsReceived: 25,
        topBids: [
          { freelancerId: "freelancer_1", name: "Alex Developer", rate: 7500, message: "I can deliver this in 4 weeks" },
          { freelancerId: "freelancer_2", name: "Jane AI Expert", rate: 8000, message: "Experienced with GPT integration" },
        ],
      };
    }),

  // ─── Submit proposal/bid ────────────────────────────────────────────────────
  submitProposal: protectedProcedure
    .input(z.object({
      jobId: z.string(),
      bidAmount: z.number().min(0),
      coverLetter: z.string(),
      deliveryDays: z.number().min(1),
      attachments: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        proposalId: `proposal_${Date.now()}`,
        jobId: input.jobId,
        freelancerId: ctx.user.id,
        bidAmount: input.bidAmount,
        status: "submitted",
        createdAt: new Date(),
        clientResponse: "pending",
      };
    }),

  // ─── Accept proposal and create contract ────────────────────────────────────
  acceptProposal: protectedProcedure
    .input(z.object({
      proposalId: z.string(),
      jobId: z.string(),
      freelancerId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        contractId: `contract_${Date.now()}`,
        proposalId: input.proposalId,
        jobId: input.jobId,
        freelancerId: input.freelancerId,
        clientId: ctx.user.id,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7776000000), // 90 days
        amount: 7500,
        escrowHeld: true,
      };
    }),

  // ─── Submit milestone ────────────────────────────────────────────────────────
  submitMilestone: protectedProcedure
    .input(z.object({
      contractId: z.string(),
      title: z.string(),
      description: z.string(),
      deliverables: z.array(z.string()),
      attachments: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        milestoneId: `milestone_${Date.now()}`,
        contractId: input.contractId,
        title: input.title,
        status: "submitted",
        submittedAt: new Date(),
        clientReview: "pending",
      };
    }),

  // ─── Approve milestone ──────────────────────────────────────────────────────
  approveMilestone: protectedProcedure
    .input(z.object({
      milestoneId: z.string(),
      contractId: z.string(),
      rating: z.number().min(1).max(5).optional(),
      feedback: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        milestoneId: input.milestoneId,
        status: "approved",
        approvedAt: new Date(),
        paymentReleased: true,
        freelancerPayout: 1875, // 25% of 7500
      };
    }),

  // ─── Get freelancer dashboard ───────────────────────────────────────────────
  getFreelancerDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        freelancerId: ctx.user.id,
        stats: {
          activeContracts: 3,
          totalEarned: 67500,
          monthlyEarnings: 8500,
          jobsCompleted: 450,
          rating: 4.9,
          responseRate: 0.98,
        },
        activeContracts: [
          {
            contractId: "contract_1",
            jobTitle: "Build AI Chatbot",
            client: "TechCorp Inc",
            amount: 7500,
            status: "in_progress",
            progress: 0.65,
            deadline: new Date(Date.now() + 1209600000),
          },
          {
            contractId: "contract_2",
            jobTitle: "React Component Library",
            client: "StartupXYZ",
            amount: 5000,
            status: "in_progress",
            progress: 0.30,
            deadline: new Date(Date.now() + 1814400000),
          },
        ],
        recentEarnings: [
          { date: new Date(Date.now() - 86400000), amount: 2500, job: "API Development" },
          { date: new Date(Date.now() - 172800000), amount: 3000, job: "Database Design" },
        ],
      };
    }),

  // ─── Get client dashboard ───────────────────────────────────────────────────
  getClientDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        clientId: ctx.user.id,
        stats: {
          activeJobs: 5,
          totalSpent: 45000,
          monthlySpend: 8500,
          jobsPosted: 25,
          avgRating: 4.7,
        },
        activeJobs: [
          {
            jobId: "job_1",
            title: "Build AI Chatbot",
            freelancer: "Alex Developer",
            amount: 7500,
            status: "in_progress",
            progress: 0.65,
            deadline: new Date(Date.now() + 1209600000),
          },
        ],
        recentPayments: [
          { date: new Date(Date.now() - 86400000), amount: 2500, job: "API Development" },
          { date: new Date(Date.now() - 172800000), amount: 3000, job: "Database Design" },
        ],
      };
    }),

  // ─── Rate freelancer ────────────────────────────────────────────────────────
  rateFreelancer: protectedProcedure
    .input(z.object({
      contractId: z.string(),
      freelancerId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string(),
      categories: z.object({
        communication: z.number().min(1).max(5),
        quality: z.number().min(1).max(5),
        timeliness: z.number().min(1).max(5),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        reviewId: `review_${Date.now()}`,
        contractId: input.contractId,
        freelancerId: input.freelancerId,
        rating: input.rating,
        status: "published",
        createdAt: new Date(),
      };
    }),

  // ─── Get talent marketplace stats ────────────────────────────────────────────
  getTalentStats: publicProcedure
    .query(async () => {
      return {
        totalFreelancers: 50000,
        totalJobs: 15000,
        totalClients: 8000,
        totalGMV: 12000000,
        avgProjectValue: 5000,
        topSkills: [
          { skill: "React", count: 5000 },
          { skill: "Python", count: 4500 },
          { skill: "Node.js", count: 4000 },
          { skill: "AI/ML", count: 3500 },
          { skill: "DevOps", count: 3000 },
        ],
      };
    }),
});
