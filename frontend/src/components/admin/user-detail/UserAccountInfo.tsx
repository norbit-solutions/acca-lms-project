
import { AdminUser } from "@/types";

interface UserAccountInfoProps {
    user: AdminUser;
}

export default function UserAccountInfo({ user }: UserAccountInfoProps) {
    return (
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
            </h2>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <dt className="text-sm text-gray-500">User ID</dt>
                    <dd className="font-medium text-gray-900">{user.id}</dd>
                </div>
                <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="font-medium text-gray-900">{user.email}</dd>
                </div>
                <div>
                    <dt className="text-sm text-gray-500">Phone</dt>
                    <dd className="font-medium text-gray-900">{user.phone}</dd>
                </div>
                <div>
                    <dt className="text-sm text-gray-500">Joined</dt>
                    <dd className="font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </dd>
                </div>
            </dl>
        </div>
    );
}
