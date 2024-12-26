"use client"

import { AnswerQuestion, GetQuestionById } from "@/actions/qaform";
import { redirect } from "next/navigation";
import React, { useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";

export default function answerquestion({
  params,
}:{
  params:Promise<{id:string}>
}) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const loadQuestion = async () => {
      const {id} = await params;
      const data:any = await GetQuestionById({ id: Number(id) });
      setQuestion(data.question);
    };
    loadQuestion();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (answer.trim() === "") {
      setError("Answer cannot be empty");
      toast.error("Answer cannot be empty");
      setIsLoading(false);
      return;
    }

    const { error, success } = await AnswerQuestion({ 
      answer: answer, 
      id: Number((await params).id) 
    });

    if (error) {
      setError(error);
      toast.error(error);
    }

    if (success) {
      toast.success("Answer submitted successfully");
      setAnswer('');
      redirect(`/`);
    }

    setIsLoading(false);
  };
console.log(question)
  return (
    <div className="flex items-center justify-center m-5">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-bold">Answer Question</h2>
        {question && (
          <div className="mb-4">
            <p className="font-medium">Question:</p>
            <p className="mb-4">{question.question}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              id="answer"
              name="answer"
              placeholder="Your answer"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Submitting...' : 'Submit Answer'}
          </button>
        </form>
      </div>
    </div>
  );
}