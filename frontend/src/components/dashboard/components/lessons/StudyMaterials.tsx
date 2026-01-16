interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface StudyMaterialsProps {
  attachments: Attachment[];
}

// Helper to get icon for document type
function getDocumentIcon(type: string) {
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('doc')) return '📝';
  if (type.includes('excel') || type.includes('sheet') || type.includes('xls')) return '📊';
  if (type.includes('powerpoint') || type.includes('presentation') || type.includes('ppt')) return '📽️';
  if (type.includes('text') || type.includes('txt')) return '📃';
  return '📎';
}

// Helper to get file extension from MIME type
function getFileExtension(type: string): string {
  const ext = type.split('/').pop() || 'file';
  return ext
    .replace('vnd.openxmlformats-officedocument.', '')
    .replace('wordprocessingml.document', 'docx')
    .replace('spreadsheetml.sheet', 'xlsx')
    .replace('presentationml.presentation', 'pptx');
}

export default function StudyMaterials({ attachments }: StudyMaterialsProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 w-full">
      <h3 className="flex items-center gap-2 text-sm font-bold text-[#333c8a] mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Study Materials
      </h3>
      <div className="space-y-2">
        {attachments.map((attachment, index) => (
          <a
            key={index}
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
          >
            <span className="text-2xl">{getDocumentIcon(attachment.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#333c8a] truncate group-hover:underline">
                {attachment.name}
              </p>
              <p className="text-xs text-black uppercase">
                {getFileExtension(attachment.type)}
              </p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#333c8a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
