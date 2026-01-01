
import { AdminUser, UserEnrollment } from "@/types";

interface UserEnrollmentsProps {
    user: AdminUser;
    onRemoveEnrollment: (enrollment: UserEnrollment) => void;
}

export default function UserEnrollments({ user, onRemoveEnrollment }: UserEnrollmentsProps) {
    // Use length of enrollments array for accurate count
    const enrollmentCount = user.enrollments?.length || 0;

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Enrollments ({enrollmentCount})
                </h2>
            </div>
            {enrollmentCount > 0 ? (
                <div className="divide-y divide-gray-100">
                    {user.enrollments?.map(
                        (enrollment) => (
                            <div
                                key={enrollment.id}
                                className="px-6 py-4 flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {enrollment.course.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Enrolled{" "}
                                        {new Date(enrollment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onRemoveEnrollment(enrollment)}
                                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="p-6 text-center text-gray-500">
                    No course enrollments
                </div>
            )}
        </div>
    );
}
