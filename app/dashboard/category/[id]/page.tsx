import { prisma } from "@/lib/prisma"
import { Expense } from "@prisma/client"
import { auth } from "@/auth"
import AddExpenseForm from "../../add-expense-form"
import Link from "next/link"
import { notFound } from "next/navigation"
import { TrashIcon } from "@heroicons/react/24/outline"
import { deleteExpense } from "../../actions"

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) return null

    const category = await prisma.category.findUnique({
        where: { id, userId: session.user.id },
        include: {
            expenses: {
                orderBy: { date: 'desc' }
            }
        }
    })

    if (!category) {
        notFound()
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard" className="text-blue-700 hover:underline">
                    ← Tornar al Tauler
                </Link>
                <h1 className="text-2xl font-bold">Despeses de {category.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-semibold mb-4">Afegir Nova Despesa</h2>
                    <AddExpenseForm categoryId={category.id} />
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Historial de Despeses</h2>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Descripció</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tipus</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Import</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Accions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-300">
                                {category.expenses.map((expense: Expense) => (
                                    <tr key={expense.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {expense.date.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {expense.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${expense.type === 'MONTHLY' ? 'bg-purple-100 text-purple-800' :
                                                    expense.type === 'ANNUAL' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'}`}>
                                                {expense.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(expense.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <form action={deleteExpense.bind(null, expense.id)}>
                                                <button
                                                    type="submit"
                                                    className="text-red-500 hover:text-red-700 transition"
                                                    title="Eliminar Despesa"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                {category.expenses.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                            Encara no hi ha despeses registrades.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
