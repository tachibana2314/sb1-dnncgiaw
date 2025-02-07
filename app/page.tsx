"use client";

import { JobApplicationForm } from "@/components/job-application-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <JobApplicationForm />
      </div>
    </main>
  );
}