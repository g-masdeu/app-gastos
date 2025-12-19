'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateCategorySchema = z.object({
    name: z.string().min(1, "El nom de la categoria és obligatori"),
})

export async function createCategory(prevState: string | undefined, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return "No autenticat"

    const data = Object.fromEntries(formData)
    const validated = CreateCategorySchema.safeParse(data)

    if (!validated.success) {
        return "Nom de categoria invàlid"
    }

    try {
        await prisma.category.create({
            data: {
                name: validated.data.name,
                userId: session.user.id,
            },
        })
        revalidatePath('/dashboard')
        return "Categoria creada"
    } catch (error) {
        console.error(error)
        return "No s'ha pogut crear la categoria"
    }
}

const CreateExpenseSchema = z.object({
    amount: z.coerce.number().min(0.01, "L'import ha de ser positiu"),
    description: z.string().min(1, "La descripció és obligatòria"),
    type: z.enum(['ONE_TIME', 'MONTHLY', 'ANNUAL']),
    categoryId: z.string(),
})

export async function createExpense(prevState: string | undefined, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return "No autenticat"

    const data = Object.fromEntries(formData)
    const validated = CreateExpenseSchema.safeParse(data)

    if (!validated.success) {
        return "Dades de despesa invàlides"
    }

    try {
        await prisma.expense.create({
            data: {
                amount: validated.data.amount,
                description: validated.data.description,
                type: validated.data.type,
                categoryId: validated.data.categoryId,
            },
        })
        revalidatePath(`/dashboard/category/${validated.data.categoryId}`)
        return "Despesa afegida"
    } catch (error) {
        console.error(error)
        return "No s'ha pogut afegir la despesa"
    }
}

export async function deleteExpense(expenseId: string) {
    const session = await auth()
    if (!session?.user?.id) return

    try {
        const expense = await prisma.expense.findUnique({
            where: { id: expenseId },
            include: { category: true }
        })

        if (!expense || expense.category.userId !== session.user.id) {
            return
        }

        await prisma.expense.delete({ where: { id: expenseId } })
        revalidatePath(`/dashboard/category/${expense.categoryId}`)
        revalidatePath('/dashboard')
    } catch (e) {
        console.error("Failed to delete expense:", e)
    }
}

export async function deleteCategory(categoryId: string) {
    const session = await auth()
    if (!session?.user?.id) return

    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        })

        if (!category || category.userId !== session.user.id) {
            return
        }

        await prisma.category.delete({ where: { id: categoryId } })
        revalidatePath('/dashboard')
    } catch (e) {
        console.error("Failed to delete category:", e)
    }
}
