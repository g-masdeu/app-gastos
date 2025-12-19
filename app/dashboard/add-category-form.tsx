'use client'

import { createCategory } from "@/app/dashboard/actions"
import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useRef } from "react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
        >
            {pending ? 'Afegint...' : 'Afegeix Categoria'}
        </button>
    )
}

export default function AddCategoryForm() {
    const [state, dispatch] = useActionState(createCategory, undefined)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state === "Categoria creada") {
            formRef.current?.reset()
        }
    }, [state])

    return (
        <form ref={formRef} action={dispatch} className="mt-4 flex gap-x-4 items-end">
            <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Nova Categoria
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder="ex. Cotxe, Menjar"
                    />
                </div>
            </div>
            <SubmitButton />
            {state && state !== "Categoria creada" && (
                <p className="text-sm text-red-500 mb-2">{state}</p>
            )}
        </form>
    )
}
