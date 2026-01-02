"use client";

import { AdminUser } from "@/types";
import { UserIcon, EmailIcon, PhoneIcon, CalendarIcon, SettingsIcon } from "@/lib/icons";

interface UserAccountInfoProps {
  user: AdminUser;
}

export default function UserAccountInfo({ user }: UserAccountInfoProps) {
  const infoItems = [
    {
      icon: UserIcon,
      label: "User ID",
      value: `#${user.id}`,
    },
    {
      icon: EmailIcon,
      label: "Email Address",
      value: user.email,
    },
    {
      icon: PhoneIcon,
      label: "Phone Number",
      value: user.phone || "Not provided",
    },
    {
      icon: CalendarIcon,
      label: "Member Since",
      value: new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    },
  ];

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Account Information
            </h2>
            <p className="text-sm text-slate-500">
              User account details and metadata
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="group p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="font-semibold text-slate-900 mt-1 truncate" title={item.value}>
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
