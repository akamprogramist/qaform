"use client";
import { AnswerQuestion, GetQuestionById } from "@/actions/qaform";
import React, { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

export default function Page({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const Numid = { id: Number(id) };
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuestion = async () => {
      if (id) {
        try {
          const { question } = await GetQuestionById(Numid);
          setQuestion(question.question);
          setAnswer(question.answer);
          setCategory(question.category);
        } catch (err) {
          toast.error(err);
        }
      }
    };
    loadQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (answer.trim() === "") {
        throw new Error("Answer cannot be empty");
      }

      const result = await AnswerQuestion({
        answer: answer,
        category: category,
        id: Number(id),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Answer submitted successfully");
      setAnswer("");
      router.push("/");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center m-5">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-bold">Answer Question</h2>

        {question && (
          <>
            <div className="mb-4">
              <p className="font-medium">Question:</p>
              <p className="mb-4">{question}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Select
                  value={category || ""}
                  onValueChange={(value) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <textarea
                  id="answer"
                  name="answer"
                  placeholder="Your answer"
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={answer || ""}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLoading ? "Submitting..." : "Submit Answer"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
