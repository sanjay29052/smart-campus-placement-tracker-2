import React, { useState } from 'react';
import {
  Cloud,
  Server,
  Database,
  HardDrive,
  Code2,
  Terminal,
  FileText,
  HelpCircle,
  Copy,
  Check,
  Download,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FLASK_CODEBASE } from '../data/flaskCodebase';
import { RESUME_BULLETS, AWS_DEPLOYMENT_STEPS, INTERVIEW_QUESTIONS } from '../data/interviewAndResume';

export const CloudArchitectureHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'architecture' | 'codebase' | 'deployment' | 'resume' | 'interview'
  >('architecture');

  // Codebase explorer state
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Interview FAQ collapse state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(1);

  const selectedFile = FLASK_CODEBASE[selectedFileIndex];

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-amber-100 text-xs font-semibold">
            <Cloud className="w-3.5 h-3.5" />
            Fresher Technical Portfolio & AWS Guide
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cloud Architecture & Code Export Hub
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90">
            Complete Flask source code, relational MySQL schemas, AWS EC2/RDS deployment runbooks, and 10 interview Q&As.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const allCode = FLASK_CODEBASE.map((f) => `### ${f.path}\n${f.content}\n\n`).join('');
              const blob = new Blob([allCode], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'smart-campus-flask-backend-codebase.txt';
              a.click();
            }}
            className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-xs hover:bg-amber-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-700" />
            Download Complete Codebase (.txt)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'architecture'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cloud className="w-4 h-4" />
          System Architecture
        </button>

        <button
          onClick={() => setActiveTab('codebase')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'codebase'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Flask Backend Codebase ({FLASK_CODEBASE.length} files)
        </button>

        <button
          onClick={() => setActiveTab('deployment')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'deployment'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          AWS Deployment Guide (14 Steps)
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'resume'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Resume Description & Bullets
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'interview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          10 Interview Q&A
        </button>
      </div>

      {/* Tab 1: Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900">Cloud Architecture Breakdown</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              The Smart Campus Monitoring System implements a 3-tier cloud application design pattern.
              By separating compute (AWS EC2), structured relational data (AWS RDS MySQL), and unstructured binary storage (AWS S3),
              the application avoids I/O bottlenecks and achieves high reliability.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Tier 1: Compute (AWS EC2)</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Ubuntu 22.04 LTS t2.micro instance</li>
                  <li>Gunicorn WSGI server (3 worker processes)</li>
                  <li>Nginx reverse proxy for SSL termination & caching</li>
                  <li>Systemd daemon for zero-downtime auto-restarts</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Tier 2: Relational DB (AWS RDS)</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Engine: MySQL 8.0 community edition</li>
                  <li>3NF Normalized Schema with foreign key cascades</li>
                  <li>Composite unique keys on `attendance(student_id, date, subject)`</li>
                  <li>VPC security group allowing traffic from EC2 only</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Tier 3: Object Store (AWS S3)</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Bucket: `smart-campus-attachments-prod`</li>
                  <li>Boto3 Python SDK upload handler</li>
                  <li>Stores grievance proof photos, lab tickets, and PDFs</li>
                  <li>Eliminates BLOB bloat from the relational database</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Flask Codebase Explorer */}
      {activeTab === 'codebase' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File Tree on left */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Project Structure
            </div>
            <div className="space-y-1">
              {FLASK_CODEBASE.map((f, idx) => (
                <button
                  key={f.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedFileIndex === idx
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{f.path}</span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded ${
                      selectedFileIndex === idx ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {f.language}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer on right */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white">{selectedFile.path}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
              </div>

              <button
                onClick={() => handleCopyCode(selectedFile.content, selectedFileIndex)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copiedIndex === selectedFileIndex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px] leading-relaxed select-text">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: AWS Deployment Guide */}
      {activeTab === 'deployment' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">AWS Production Deployment Guide (Step-by-Step)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow these commands on your terminal to launch the Flask Smart Campus system live on AWS EC2 & RDS.
            </p>
          </div>

          <div className="space-y-4">
            {AWS_DEPLOYMENT_STEPS.map((s) => (
              <div key={s.step} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {s.step}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{s.title}</h4>
                </div>
                <p className="text-xs text-slate-600 font-mono pl-8 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Resume Bullets */}
      {activeTab === 'resume' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Resume Project Description (Tailored for Freshers)</h3>
              <p className="text-xs text-slate-500">
                Copy and paste these bullet points into your resume under the "Projects" section.
              </p>
            </div>
            <button
              onClick={() => handleCopyCode(RESUME_BULLETS.join('\n• '), 99)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedIndex === 99 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy All Bullets
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="font-bold text-sm text-slate-900">
              Cloud-Based Smart Campus Monitoring System | Python (Flask), MySQL, AWS (EC2, RDS, S3)
            </div>
            <ul className="space-y-2 text-slate-700">
              {RESUME_BULLETS.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{bullet.replace(/\*\*/g, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 5: 10 Interview Q&As */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">10 Comprehensive Technical Interview Questions & Answers</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Engineered specifically to help you ace software engineering & cloud technical interviews.
            </p>
          </div>

          <div className="space-y-3">
            {INTERVIEW_QUESTIONS.map((q) => {
              const isOpen = expandedFaq === q.id;
              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : q.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {q.id}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {q.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                          {q.question}
                        </h4>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-700 border-t border-slate-100 bg-slate-50/40 space-y-3">
                      <p className="leading-relaxed whitespace-pre-line">{q.answer}</p>
                      <div className="pt-2 border-t border-slate-200/80">
                        <span className="font-bold text-[11px] text-slate-900 block mb-1">
                          Key Talking Points for Interviewer:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {q.keyPoints.map((point, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-medium"
                            >
                              ✓ {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
