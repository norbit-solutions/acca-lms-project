import Link from "next/link";

export default function NotFoundPage() {
    return <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
        
        <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">Back to home</Link>
    </div>
}