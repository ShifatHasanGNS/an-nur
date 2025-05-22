"use client";

import { useEffect, useState } from "react";
import { questionsData } from "@/constants/questions";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleOptionChange = (index, option) => {
    setAnswers({ ...answers, [index]: option });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = questions.reduce((acc, q, i) => {
    if (answers[i] === q.correctAnswer) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Quiz</CardTitle>
            {!submitted && (
              <div className="text-lg font-medium">
                Time:{" "}
                <span
                  className={cn(
                    "ml-2 tabular-nums",
                    timeLeft < 60 && "text-red-500 animate-pulse"
                  )}
                >
                  {Math.floor(timeLeft / 60)}:
                  {("0" + (timeLeft % 60)).slice(-2)}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-4">
            {questions.map((q, index) => (
              <div key={index} className="mb-8">
                <div className="flex items-start gap-2 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                    {index + 1}
                  </span>
                  <Label className="text-lg font-medium leading-none pt-1.5">
                    {q.question}
                  </Label>
                </div>
                <RadioGroup
                  disabled={submitted}
                  value={answers[index]}
                  onValueChange={(value) => handleOptionChange(index, value)}
                  className="ml-10"
                >
                  {q.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem
                        value={option}
                        id={`q${index}-option${idx}`}
                        className={cn(
                          submitted &&
                            option === q.correctAnswer &&
                            "border-green-500 bg-green-500",
                          submitted &&
                            answers[index] === option &&
                            option !== q.correctAnswer &&
                            "border-red-500 bg-red-500"
                        )}
                      />
                      <Label
                        htmlFor={`q${index}-option${idx}`}
                        className={cn(
                          "cursor-pointer",
                          submitted &&
                            option === q.correctAnswer &&
                            "text-green-600 font-medium",
                          submitted &&
                            answers[index] === option &&
                            option !== q.correctAnswer &&
                            "text-red-600 font-medium"
                        )}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </ScrollArea>

          <div className="mt-6 flex items-center justify-between">
            {!submitted ? (
              <Button onClick={handleSubmit} size="lg">
                Submit Quiz
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold">
                  Your Score: <span className="text-primary">{score}/10</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ({((score / 10) * 100).toFixed(0)}% correct)
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
