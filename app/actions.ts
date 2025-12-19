'use server'

import { prisma } from "@/lib/prisma"
import { signIn } from "@/auth"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { z } from "zod"

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
})

export async function register(prevState: string | undefined, formData: FormData) {
    try {
        const data = Object.fromEntries(formData)
        const validatedFields = RegisterSchema.safeParse(data)

        if (!validatedFields.success) {
            return "Camps invàlids"
        }

        const { email, password, name } = validatedFields.data

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return "Aquest correu electrònic ja està en ús"
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        // Auto login after register (optional, or just redirect)
        // await signIn('credentials', { email, password, redirectTo: '/dashboard' })
        return "Usuari creat correctament"
    } catch (error) {
        if (error instanceof AuthError) {
            return "El registre ha fallat"
        }
        throw error
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/dashboard' })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credencials invàlides.'
                default:
                    return 'Alguna cosa ha anat malament.'
            }
        }
        throw error
    }
}
