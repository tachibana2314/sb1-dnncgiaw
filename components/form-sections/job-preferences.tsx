"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { jobApplicationSchema } from "@/lib/validations/job-application";

const timingOptions = [
  { value: "asap", label: "なるべく早く" },
  { value: "1month", label: "1ヶ月以内" },
  { value: "3months", label: "3ヶ月以内" },
  { value: "6months", label: "6ヶ月以内" },
  { value: "1year", label: "1年以内" },
];

const jobTypes = [
  { value: "truck", label: "トラックドライバー" },
  { value: "bus", label: "バスドライバー" },
  { value: "taxi", label: "タクシードライバー" },
  { value: "waste", label: "廃棄物収集運搬ドライバー" },
  { value: "sales", label: "ルート営業" },
  { value: "manager", label: "運行管理者" },
  { value: "other", label: "その他" },
];

type JobPreferencesProps = {
  form: UseFormReturn<z.infer<typeof jobApplicationSchema>>;
};

export function JobPreferences({ form }: JobPreferencesProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="timing"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-[#002559] font-bold">
              転職希望時期 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
              >
                {timingOptions.map((option) => (
                  <FormItem 
                    key={option.value}
                    className="flex items-center space-x-3 space-y-0 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" 
                    onClick={() => field.onChange(option.value)}
                  >
                    <FormControl>
                      <RadioGroupItem value={option.value} className="w-5 h-5" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer w-full m-0">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="jobType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-[#002559] font-bold">
              希望職種 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6"
              >
                {jobTypes.map((job) => (
                  <FormItem 
                    key={job.value}
                    className="flex items-center space-x-3 space-y-0 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" 
                    onClick={() => field.onChange(job.value)}
                  >
                    <FormControl>
                      <RadioGroupItem value={job.value} className="w-5 h-5" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer w-full m-0">
                      {job.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}