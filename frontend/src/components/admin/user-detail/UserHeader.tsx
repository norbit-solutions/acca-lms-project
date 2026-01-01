
import { AdminUser } from "@/types";
import { BackIcon } from "@/lib/icons";
import { useRouter } from "next/navigation";

interface UserHeaderProps {
    user: AdminUser;
}

export default function UserHeader({ user }: UserHeaderProps) {
    const router = useRouter();

    return (
        <div className="mb-8">
            <button
                onClick={() => router.push("/admin/users")}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <BackIcon className="w-4 h-4" />
                </div>
                <span className="font-medium">Back to Users</span>
            </button>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.fullName ? user.fullName.charAt(0) : "?"}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {user?.fullName || "Unknown User"}
                    </h1>
                    <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-500">{user.email}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{user.phone}</span>
                        <span
                            className={`px-2 py-1 rounded text-xs font-medium ${user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
