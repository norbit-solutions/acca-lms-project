
import { PlusIcon } from "@/lib/icons";

interface EnrollmentsHeaderProps {
    onNewEnrollment: () => void;
}

export default function EnrollmentsHeader({ onNewEnrollment }: EnrollmentsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-medium text-slate-900">Enrollments</h1>
                <p className="text-slate-500 text-sm mt-1">Manage student course access</p>
            </div>
            <button
                onClick={onNewEnrollment}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
            >
                <PlusIcon />
                New Enrollment
            </button>
        </div>
    );
}
