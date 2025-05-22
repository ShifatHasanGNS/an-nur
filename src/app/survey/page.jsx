"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

export default function SurveyPage() {
  const questions = [
    "১. আপনার এলাকায় বর্তমানে দিনের গড় তাপমাত্রা কত ডিগ্রি সেলসিয়াস?",
    "২. গত এক সপ্তাহে বৃষ্টিপাত হয়েছে কি? হলে কত দিন?",
    "৩. আপনার গ্রামে কী ধরণের জ্বালানি ব্যবহার করা হয় (গ্যাস/কাঠ/গবাদি পশুর গোবর) ?",
    "৪. কোনো নদী বা পুকুরে পানি কতটা পরিষ্কার মনে হয়? (পরিষ্কার/মাঝারি/দূষিত)?",
    "৫. আপনার এলাকায় সর্বশেষ বৃষ্টিপাত কবে হয়েছিল?",
    "৬. আপনার এলাকায় কি কোনো দূষণ লক্ষ্য করেছেন?",
    "৭. আপনার এলাকায় আপনি কত প্রকার পাখি প্রতিদিন দেখতে পান?",
    "৮. আপনার এলাকায় কোনো বিরল গাছ বা প্রাণী আছে কি?",
    "৯. কোনো মৌসুমে সবচেয়ে বেশি পাখি দেখা যায় বলে আপনি মনে করেন?",
    "১০. আপনি কি স্থানীয় খোলা জলের উৎস থেকে পানি পান করেন?",
    "১১. আপনার এলাকায় ডেঙ্গু/ম্যালেরিয়া বা অনুরূপ রোগের ঘটনা ঘটে কি?",
    "১২. আপনি আকাশে সবচেয়ে উজ্জ্বল তারা চিনতে পারেন কি?",
    "১৩. আপনি কখনো কোনো নতুন গাছ লাগিয়েছেন কি?",
    "১৪. আপনি কি কখনো কোনো উল্কা/ঝলক দেখতে পেয়েছেন?",
    "১৫. আপনি কীভাবে আবহাওয়ার পরিবর্তন বুঝতে পারেন?",
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    console.log("Survey Answers:", answers); // Replace with API logic
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            পরিবেশ-বিজ্ঞান জরিপ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center text-green-600 text-xl py-12">
              আপনাকে ধন্যবাদ আমাদের মূল্যবান সময় দেওয়ার জন্য।
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <ScrollArea className="h-[60vh] pr-4">
                {questions.map((question, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      <Label className="text-lg font-medium leading-snug pt-1.5">
                        {question}
                      </Label>
                    </div>
                    <Input
                      type="text"
                      value={answers[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                      required
                      placeholder="আপনার উত্তর লিখুন..."
                      className="ml-10"
                    />
                  </div>
                ))}
              </ScrollArea>

              <div className="mt-6 flex justify-center">
                <Button type="submit" size="lg">
                  সাবমিট করুন
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
