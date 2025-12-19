import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex border-b border-gray-200 pb-6 mb-10">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          App Gastos
        </p>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Controla les teves despeses fàcilment
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-700">
          Gestiona les teves despeses mensuals, anuals i diàries de manera eficient.
          Categoritza les teves despeses i fes un seguiment del teu pressupost.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/login" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Inicia sessió
          </Link>
          <Link href="/register" className="text-sm font-semibold leading-6 text-gray-900">
            Registra't <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
