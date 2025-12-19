'use client'

import { createExpense } from "@/app/dashboard/actions"
import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useRef } from "react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-green-300"
        >
            {pending ? 'Afegint Despesa...' : 'Afegeix Despesa'}
        </button>
    )
}

export default function AddExpenseForm({ categoryId }: { categoryId: string }) {
    const [state, dispatch] = useActionState(createExpense, undefined)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state === "Despesa afegida") {
            formRef.current?.reset()
        }
    }, [state])

    return (
        <form ref={formRef} action={dispatch} className="bg-white p-6 rounded-lg shadow space-y-4">
            <input type="hidden" name="categoryId" value={categoryId} />

            <div>
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Descripció
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        name="description"
                        id="description"
                        required
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                        placeholder="ex. Gasolina"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
                    Import
                </label>
                <div className="mt-2">
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        step="0.01"
                        required
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                    Tipus
                </label>
                <div className="mt-2">
                    <select
                        id="type"
                        name="type"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                        defaultValue="MONTHLY"
                    >
                        <option value="ONE_TIME">Puntual</option>
                        <option value="MONTHLY">Mensual</option>
                        <option value="ANNUAL">Anual</option>
                    </select>
                </div>
            </div>

            <SubmitButton />

            {state && state !== "Despesa afegida" && (
                <p className="text-sm text-red-500 text-center">{state}</p>
            )}
        </form>
    )
}
