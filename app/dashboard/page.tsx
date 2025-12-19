import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import AddCategoryForm from "./add-category-form"
import Link from "next/link"
import { TrashIcon } from "@heroicons/react/24/outline"
import { deleteCategory } from "./actions"
import { Prisma } from "@prisma/client"

type CategoryWithData = Prisma.CategoryGetPayload<{
    include: {
        _count: { select: { expenses: true } }
        expenses: { select: { amount: true } }
    }
}>

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) return null

    const categories = await prisma.category.findMany({
        where: { userId: session.user.id },
        include: {
            _count: { select: { expenses: true } },
            expenses: { select: { amount: true } }
        }
    })

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Les meves categories</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <AddCategoryForm />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category: CategoryWithData) => (
                    <div key={category.id} className="relative group">
                        <Link
                            href={`/dashboard/category/${category.id}`}
                            className="block p-6 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
                        >
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 pr-8">{category.name}</h5>
                            <div className="flex justify-between items-end mt-4">
                                <p className="font-normal text-gray-800">
                                    {category._count.expenses} despeses
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                                        category.expenses.reduce((sum: number, expense: { amount: number }) => sum + expense.amount, 0)
                                    )}
                                </p>
                            </div>
                        </Link>
                        <form
                            action={deleteCategory.bind(null, category.id)}
                            className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <button
                                type="submit"
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                title="Eliminar Categoria"
                            >
                                <TrashIcon className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                ))}

                {categories.length === 0 && (
                    <p className="text-gray-600 col-span-full">No s'han trobat categories. Crea'n una a dalt!</p>
                )}
            </div>
        </div>
    )
}
