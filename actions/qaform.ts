"use server"

import { revalidatePath } from "next/cache";
import prisma from "../lib/db";

export async function AddQuestion({ question }: { question: string }) {
    try {
        const result = await prisma.question.create({
            data: {
                question,
            },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "An unexpected error occurred" };
    }
}
export async function GetQuestion() {
    try {
        const question = await prisma.question.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return { question };
    } catch (error) {
        return { error: "Can't Fetch Questions" };
    }
}
export async function DeleteQuestion({ id }: { id: number }) {
    try {
        await prisma.question.delete({
            where: {
                id,
            },
        });
        revalidatePath("/");
        return { success: "Question deleted successfully" };
    } catch (error) {
        return { error: "Can't delete question" };
    }
}
export async function GetQuestionById({ id }: { id: number }) {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      throw new Error("Question not found");
    }
    
    return { question };
  } catch (error) {
    return { error: "Can't fetch question" };
  }
}

export async function AnswerQuestion({ id,answer }: { id: number,answer:string }) {
    try {
        await prisma.question.update({
            data: {
                answer
            },
            where: {
                id,
            },
        })
        
        return { success: "Question Answered successfully" };
    } catch (error) {
        return { error: "Can't answer question" };
    }
}