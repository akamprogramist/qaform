"use client";

import { AddQuestion } from "@/actions/qaform";
import { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function FormCard() {
  const [Question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (Question.trim() === "") {
      setError("Question cannot be empty");
      toast.error("Question cannot be empty");
      setIsLoading(false);
      return;
    }

    const { error, success } = await AddQuestion({ question: Question.trim() });

    if (error) {
      setError(error);
      toast.error(error);
    }

    if (success) {
      toast.success("Question submitted successfully");
    }

    setQuestion("");
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ask Me Anything
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                id="question"
                name="question"
                rows="4"
                placeholder="What's on your mind? Ask away..."
                className="w-full rounded-lg bg-gray-700 border-gray-600 px-4 py-3 text-gray-100 
                          placeholder:text-gray-400 focus:outline-none focus:ring-2 
                          focus:ring-blue-400 focus:border-transparent transition-all duration-200
                          resize-none"
                value={Question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 
                        px-4 py-3 text-white font-medium hover:from-blue-600 hover:to-purple-600 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                        focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed
                        transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading && <Loader2 size={20} className="animate-spin" />}
              <span>{isLoading ? "Submitting..." : "Submit Question"}</span>
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
