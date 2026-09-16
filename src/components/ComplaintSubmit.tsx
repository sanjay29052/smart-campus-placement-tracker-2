import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  FilePlus,
  Cloud,
  UploadCloud,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ComplaintCategory } from '../types';

export const ComplaintSubmit: React.FC = () => {
  const { currentUser, submitComplaint, setCurrentPage } = useApp();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Infrastructure');
  const [description, setDescription] = useState('');

  // S3 Attachment upload state
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    previewUrl?: string;
  } | null>(null);

  const [uploadingToS3, setUploadingToS3] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: ComplaintCategory[] = [
    'Infrastructure',
    'Hostel',
    'Academics',
    'Mess & Canteen',
    'Laboratory',
    'Transport',
    'Library',
    'Other',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeKB = Math.round(file.size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

      // If image, create object url
      let previewUrl: string | undefined;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }

      setSelectedFile({
        name: file.name,
        size: sizeStr,
        previewUrl,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setUploadingToS3(true);

    // Simulate S3 Boto3 upload
    setTimeout(() => {
      const studentId = currentUser?.student_id || 'STU2022001';
      const s3Url = selectedFile
        ? selectedFile.previewUrl || `https://smart-campus-attachments-prod.s3.amazonaws.com/complaints/${selectedFile.name}`
        : undefined;

      const ticketNo = submitComplaint({
        student_id: studentId,
        subject,
        category,
        description,
        attachment_name: selectedFile?.name,
        attachment_url: s3Url,
      });

      setUploadingToS3(false);
      setSubmittedTicket(ticketNo);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Submit Campus Grievance</h1>
        <p className="text-xs text-slate-500">
          Lodge facility, academic, or hostel issues with direct S3 evidence storage and ticket tracking.
        </p>
      </div>

      {submittedTicket ? (
        /* Success Screen */
        <div className="p-8 rounded-2xl bg-white border border-emerald-200 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Ticket Logged Successfully
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 font-mono">{submittedTicket}</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Your grievance has been submitted to the Department Maintenance & Welfare committee. An automated tracking ticket has been registered in the database.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-md mx-auto space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Subject:</span>
              <span className="font-semibold text-slate-800 truncate">{subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="font-semibold text-slate-800">{category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">AWS S3 Attachment:</span>
              <span className="font-semibold text-blue-600 truncate">{selectedFile ? selectedFile.name : 'None'}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setSubject('');
                setDescription('');
                setSelectedFile(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Submit Another Grievance
            </button>
            <button
              onClick={() => setCurrentPage('complaint-track')}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              Track This Ticket
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grievance Subject / Brief Title *
              </label>
              <input
                id="complaint-subject"
                type="text"
                required
                placeholder="e.g. Broken water purifier in Hostel Block C, 2nd floor"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Category *
                </label>
                <select
                  id="complaint-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student ID & Name
                </label>
                <div className="px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                  {currentUser?.name || 'Aarav Sharma'} ({currentUser?.student_id || 'STU2022001'})
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description of the Problem *
              </label>
              <textarea
                id="complaint-description"
                required
                rows={4}
                placeholder="Please describe the issue in detail including exact location, lab number, or room number..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {description.length} characters entered
              </span>
            </div>

            {/* AWS S3 Evidence Attachment Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Photo Evidence / Document (AWS S3 Cloud Store)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="complaint-file-input"
              />

              {selectedFile ? (
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {selectedFile.previewUrl ? (
                      <img
                        src={selectedFile.previewUrl}
                        alt="Evidence preview"
                        className="w-12 h-12 rounded-lg object-cover border border-blue-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-slate-900 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {selectedFile.size} • Target: <span className="font-mono text-blue-700">s3://smart-campus-attachments-prod</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50"
                >
                  <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drag file here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports PNG, JPG, PDF up to 16MB (Direct AWS S3 multipart upload)
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Encrypted & tracked in MySQL database
              </span>

              <button
                type="submit"
                disabled={uploadingToS3}
                id="submit-complaint-btn"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {uploadingToS3 ? (
                  <>
                    <Cloud className="w-4 h-4 animate-spin text-white" />
                    Uploading to AWS S3...
                  </>
                ) : (
                  <>
                    <FilePlus className="w-4 h-4" />
                    Lodge Grievance Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
