'use client'

import { register } from "@/app/actions"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300"
        >
            {pending ? 'Registrant...' : "Registra't"}
        </button>
    )
}

export default function RegisterPage() {
    const [state, dispatch] = useActionState(register, undefined)
    const router = useRouter()

    useEffect(() => {
        if (state === "Usuari creat correctament") {
            router.push('/login?registered=true')
        }
    }, [state, router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="w-full max-w-md space-y-8">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Crea un compte
                </h2>
                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm space-y-2">
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="relative block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                placeholder="Nom (Opcional)"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="relative block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                placeholder="Correu electrònic"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                placeholder="Contrasenya"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/login" className="font-medium text-green-700 hover:text-green-600">
                                Ja tens un compte? Inicia sessió
                            </a>
                        </div>
                    </div>

                    <div>
                        <SubmitButton />
                    </div>
                    {state && state !== "Usuari creat correctament" && (
                        <p className="text-sm text-red-500 text-center">{state}</p>
                    )}
                </form>
            </div>
        </div>
    )
}
