'use client'

import { authenticate } from "@/app/actions"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
            {pending ? 'Iniciant sessió...' : 'Inicia sessió'}
        </button>
    )
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined)

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="w-full max-w-md space-y-8">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Inicia sessió al teu compte
                </h2>
                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="relative block w-full rounded-t-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="Correu electrònic"
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-b-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="Contrasenya"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/register" className="font-medium text-blue-700 hover:text-blue-600">
                                No tens compte? Registra't
                            </a>
                        </div>
                    </div>

                    <div>
                        <SubmitButton />
                    </div>
                    {errorMessage && (
                        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
                    )}
                </form>
            </div>
        </div>
    )
}
