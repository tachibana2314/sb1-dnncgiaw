"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { jobApplicationSchema } from "@/lib/validations/job-application";
import { useEffect, useState } from "react";

type AddressData = {
  pref: string;
  cities: { city: string }[];
};

type ContactInfoProps = {
  form: UseFormReturn<z.infer<typeof jobApplicationSchema>>;
};

export function ContactInfo({ form }: ContactInfoProps) {
  const [addressData, setAddressData] = useState<AddressData[]>([]);
  const [prefectures, setPrefectures] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://japanese-addresses-v2.geoloniamaps.com/api/ja.json')
      .then(response => response.json())
      .then(data => {
        if (!Array.isArray(data.data)) {
          throw new Error('データが配列ではありません');
        }
        setAddressData(data.data);
        const prefs = data.data.map((item: AddressData) => item.pref);
        setPrefectures(prefs);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('データの取得に失敗しました:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedPrefecture || !addressData.length) return;

    const selectedData = addressData.find(pref => pref.pref === selectedPrefecture);
    if (selectedData) {
      const uniqueCities = Array.from(
        new Set(
          selectedData.cities.map(city => city.city)
        )
      ).sort();
      setCities(uniqueCities);
      form.setValue('city', '市区町村');
    }
  }, [selectedPrefecture, addressData, form]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="prefecture"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#002559] font-bold">
                希望勤務地 <span className="text-red-500">*</span>
              </FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedPrefecture(value);
                }} 
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue placeholder={isLoading ? "読み込み中..." : "都道府県"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {prefectures.map((pref) => (
                    <SelectItem key={pref} value={pref}>
                      {pref}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#002559] font-bold">
                　
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || "市区町村"}
                disabled={!selectedPrefecture || isLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue>
                      {field.value || "市区町村"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#002559] font-bold">
              電話番号 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="text"
                inputMode="numeric"
                placeholder="09012345678" 
                className="h-12 border-gray-300"
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#002559] font-bold">
              メールアドレス <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="taro@ne.jp" 
                type="email" 
                className="h-12 border-gray-300"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}