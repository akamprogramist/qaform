"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/db";

export async function AddQuestion({ question }) {
  try {
    await prisma.question.create({
      data: { question },
    });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("AddQuestion error:", err);
    return { error: err.message || "An unexpected error occurred" };
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
  } catch {
    return { error: "Can't Fetch Questions" };
  }
}

export async function DeleteQuestion({ id }) {
  try {
    await prisma.question.delete({
      where: {
        id,
      },
    });
    revalidatePath("/");
    return { success: "Question deleted successfully" };
  } catch {
    return { error: "Can't delete question" };
  }
}

export async function GetQuestionById({ id }) {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      throw new Error("Question not found");
    }

    return { question };
  } catch {
    return { error: "Can't fetch question" };
  }
}

export async function AnswerQuestion({ id, answer, category }) {
  try {
    if (!id || !answer || !category) {
      throw new Error("Missing required fields");
    }

    await prisma.question.update({
      data: {
        answer,
        category,
      },
      where: {
        id: id,
      },
    });

    return { success: true, message: "Question Answered successfully" };
  } catch (err) {
    console.error("Error updating question:", err);
    return { error: err.message || "Can't answer question" };
  }
}
