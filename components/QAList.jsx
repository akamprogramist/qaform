"use client";

import { DeleteQuestion } from "@/actions/qaform";
import { Briefcase, Code, Edit, Shuffle, Trash2, User } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/context/CurrentUserContext";
import { useState, useEffect } from "react";

export default function QAList({ question }) {
  const { currentUser } = useCurrentUser();
  const [filteredQuestions, setFilteredQuestions] = useState(question);
  const [activeCategory, setActiveCategory] = useState("all");

  // Function to handle delete
  async function deletequestion(id) {
    const { error, success } = await DeleteQuestion({ id });
    if (error) return setError(error);
  }

  // Category buttons
  const buttons = [
    { label: "all", icon: Shuffle },
    { label: "personal", icon: User },
    { label: "business", icon: Briefcase },
    { label: "coding", icon: Code },
  ];

  // Filter questions when category is selected
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredQuestions(question);
    } else {
      setFilteredQuestions(
        question.filter((q) => q.category === activeCategory)
      );
    }
  }, [activeCategory, question]);

  return (
    <>
      <div className="max-w-2xl mx-auto flex justify-center items-center px-4 py-2">
        <div className="w-full grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          {buttons.map((button) => (
            <button
              key={button.label}
              onClick={() => setActiveCategory(button.label)}
              className={`
              relative 
              px-4 py-2 
              rounded-lg 
              text-white 
              font-semibold
              flex items-center justify-center 
              capitalize 
              text-lg
              sm:text-md
              space-x-2 
              hover:bg-gray-900
              transition-all 
              duration-300 
              ease-in-out
              ${
                activeCategory === button.label
                  ? `bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg`
                  : "bg-gray-800 border border-gray-700"
              }
            `}
            >
              <button.icon className="mr-2 w-5 h-5" />
              <span>{button.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-900 p-4">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Q&A List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredQuestions?.map((q) => (
                <div
                  key={q.id}
                  className="group relative p-6 rounded-xl bg-gradient-to-b from-gray-700/90 to-gray-800/90 
                  border border-gray-600/50 shadow-lg transition-all duration-300 
                  hover:shadow-blue-500/10 hover:border-gray-500"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 
                          text-blue-400 font-semibold text-sm"
                      >
                        {q.id}
                      </span>
                      <h3
                        className="text-lg font-semibold bg-gradient-to-r from-gray-100 to-gray-300 
                        bg-clip-text text-transparent"
                      >
                        Question:
                      </h3>
                    </div>
                    {currentUser && currentUser.role === "ADMIN" && (
                      <div
                        className="flex items-center space-x-2 opacity-80 group-hover:opacity-100 
                        transition-opacity duration-200"
                      >
                        <Link
                          href={`/answer/${q.id}`}
                          className="p-2 rounded-lg hover:bg-gray-600/50 text-emerald-400 
                        hover:text-emerald-300 transition-all duration-200"
                        >
                          <Edit
                            size={18}
                            className="transform hover:scale-110 transition-transform duration-200"
                          />
                        </Link>
                        <button
                          onClick={() => deletequestion(q.id)}
                          className="p-2 rounded-lg hover:bg-gray-600/50 text-rose-400 
                        hover:text-rose-300 transition-all duration-200"
                        >
                          <Trash2
                            size={18}
                            className="transform hover:scale-110 transition-transform duration-200"
                          />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-300 mb-4 pl-10">{q.question}</p>

                  {q.answer !== null && (
                    <div className="mt-4 pt-4 border-t border-gray-600/50">
                      <div className="flex items-center space-x-2 mb-3">
                        <span
                          className="flex items-center justify-center w-8 h-8 rounded-lg 
                             bg-emerald-500/10 text-emerald-400 font-semibold text-sm"
                        >
                          A
                        </span>
                        <h4
                          className="text-md font-semibold bg-gradient-to-r from-emerald-300 
                           to-emerald-400 bg-clip-text text-transparent"
                        >
                          Answer:
                        </h4>
                      </div>
                      <p className="text-gray-300 pl-10">{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
