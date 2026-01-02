"use client";

import { DocumentIcon, DownloadIcon } from "@/lib/icons";

interface Attachment {
  url: string;
  name: string;
  type: string;
}

interface LessonAttachmentsProps {
  attachments: Attachment[] | null;
}

export default function LessonAttachments({ attachments }: LessonAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-display font-semibold text-slate-900">Attachments</h2>
        </div>
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <DocumentIcon className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">No attachments for this lesson</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-display font-semibold text-slate-900">Attachments</h2>
        <span className="text-sm text-slate-500">{attachments.length} files</span>
      </div>
      <div className="divide-y divide-slate-100">
        {attachments.map((attachment, index) => (
          <a
            key={index}
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{attachment.name}</p>
                <p className="text-xs text-slate-500 capitalize">{attachment.type}</p>
              </div>
            </div>
            <div className="text-slate-400 hover:text-slate-600 transition-colors">
              <DownloadIcon className="w-5 h-5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
