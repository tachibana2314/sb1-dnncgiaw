"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { jobApplicationSchema } from "@/lib/validations/job-application";
import { PersonalInfo } from "./form-sections/personal-info";
import { JobPreferences } from "./form-sections/job-preferences";
import { ContactInfo } from "./form-sections/contact-info";

const JobApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const form = useForm<z.infer<typeof jobApplicationSchema>>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      lastNameKana: "",
      firstNameKana: "",
      birthDate: "",
      timing: "",
      jobType: "",
      prefecture: "",
      city: "",
      phone: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof jobApplicationSchema>) {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }

      setMessage({
        text: "応募フォームの送信が完了しました。",
        isError: false
      });

      // フォームをリセット
      form.reset();
    } catch (error) {
      console.error(error);
      setMessage({
        text: "送信に失敗しました。もう一度お試しください。",
        isError: true
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.isError
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <PersonalInfo form={form} />
          <JobPreferences form={form} />
          <ContactInfo form={form} />
        </div>

        <div className="text-sm text-gray-600 mt-8">
          <p>
            <a href="#" className="underline">プライバシーポリシー</a>と<a href="#" className="underline">利用規約</a>をご確認の上、
            「同意して登録する」ボタンを押してください。
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 bg-red-600 hover:bg-red-700 text-xl rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              送信中...
            </>
          ) : (
            "同意して登録する"
          )}
        </Button>
      </form>
    </Form>
  );
};

export { JobApplicationForm };