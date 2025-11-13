import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold text-slate-700 mb-4">Recipe Not Found</h2>
        <p className="text-slate-600 mb-8">
          Sorry, we couldn't find the recipe you're looking for. It may have been removed or the link might be
          incorrect.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center justify-center bg-brand-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Browse All Recipes
        </Link>
      </div>
    </div>
  )
}
