"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { jobApplicationSchema } from "@/lib/validations/job-application";

type PersonalInfoProps = {
  form: UseFormReturn<z.infer<typeof jobApplicationSchema>>;
};

export function PersonalInfo({ form }: PersonalInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#002559] font-bold">
                姓 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="(例)山田" 
                  className="h-12 border-gray-300 placeholder:text-gray-400"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#002559] font-bold">
                名 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="(例)太郎" 
                  className="h-12 border-gray-300 placeholder:text-gray-400"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="lastNameKana"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#002559] font-bold">
                姓かな <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="(例)やまだ" 
                  className="h-12 border-gray-300 placeholder:text-gray-400"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstNameKana"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#002559] font-bold">
                名かな <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="(例)たろう" 
                  className="h-12 border-gray-300 placeholder:text-gray-400"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#002559] font-bold">
              生年月日 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="text"
                inputMode="numeric"
                placeholder="19900101"
                className="h-12 border-gray-300 w-full"
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '').slice(0, 8);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}