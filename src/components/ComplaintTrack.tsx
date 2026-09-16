import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
  ChevronRight,
  Filter,
  User,
  Calendar,
  MessageSquare,
  Image,
} from 'lucide-react';
import { ComplaintStatus } from '../types';

export const ComplaintTrack: React.FC = () => {
  const { complaints, currentUser, setCurrentPage } = useApp();

  const [ticketSearch, setTicketSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  // If student, filter by student_id by default, but allow tracking any ticket number
  const myComplaints = currentUser?.role === 'student'
    ? complaints.filter((c) => c.student_id === currentUser.student_id)
    : complaints;

  const filtered = complaints.filter((c) => {
    const matchesTicket =
      !ticketSearch ||
      c.ticket_no.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      c.subject.toLowerCase().includes(ticketSearch.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All' || c.status === selectedStatus;

    // If searching specific ticket, allow search across all tickets
    if (ticketSearch.trim().length > 0) {
      return matchesTicket && matchesStatus;
    }

    // Default to user's tickets if student
    if (currentUser?.role === 'student') {
      return c.student_id === currentUser.student_id && matchesStatus;
    }

    return matchesTicket && matchesStatus;
  });

  const activeTicket = selectedTicketId
    ? complaints.find((c) => c.id === selectedTicketId)
    : filtered[0] || null;

  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'In Progress':
        return 2;
      case 'Resolved':
        return 3;
      case 'Rejected':
        return 1;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grievance Status Tracking</h1>
          <p className="text-xs text-slate-500">
            Real-time status updates, admin resolution remarks, and AWS S3 evidence inspector
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('complaint-submit')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          + Submit New Grievance
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="track-search-ticket-input"
            type="text"
            placeholder="Search by Ticket ID (e.g. CMP-2026-101) or keyword..."
            value={ticketSearch}
            onChange={(e) => setTicketSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Status:</span>
            <select
              id="track-filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Two-Pane View: Ticket List on left, Detailed Status Stepper on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Complaints List ({filtered.length})
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-700">No grievance tickets found.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching another ticket ID or lodge a new one.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = activeTicket?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTicketId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-400 ring-1 ring-blue-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono font-bold text-xs text-blue-700">{item.ticket_no}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.subject}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.category}</span>
                    <span>{item.created_at}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Ticket Inspector & Progress Stepper */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                    {activeTicket.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{activeTicket.subject}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Ticket: {activeTicket.ticket_no} • Filed by {activeTicket.student_name} ({activeTicket.student_id})
                  </p>
                </div>

                <span
                  className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full ${
                    activeTicket.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeTicket.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : activeTicket.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeTicket.status}
                </span>
              </div>

              {/* Progress Stepper */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-3">Resolution Lifecycle Progress</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="w-8 h-8 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      1
                    </div>
                    <span className="text-xs font-semibold text-slate-800 block">Ticket Lodged</span>
                    <span className="text-[10px] text-slate-400 block">{activeTicket.created_at}</span>
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                        getStepIndex(activeTicket.status) >= 2
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      2
                    </div>
                    <span className="text-xs font-semibold text-slate-800 block">Under Review</span>
                    <span className="text-[10px] text-slate-400 block">Assigned to team</span>
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                        activeTicket.status === 'Resolved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      3
                    </div>
                    <span className="text-xs font-semibold text-slate-800 block">Resolved</span>
                    <span className="text-[10px] text-slate-400 block">
                      {activeTicket.status === 'Resolved' ? 'Completed & Verified' : 'Pending resolution'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-700">Problem Description:</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {activeTicket.description}
                </p>
              </div>

              {/* Attachment preview if exists */}
              {activeTicket.attachment_url && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-blue-600" />
                    AWS S3 Evidence Attachment ({activeTicket.attachment_name || 'screenshot.jpg'})
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-4">
                    <img
                      src={activeTicket.attachment_url}
                      alt="Attachment Preview"
                      className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-slate-800">{activeTicket.attachment_name || 'Evidence Image'}</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                        s3://smart-campus-attachments-prod/complaints/{activeTicket.ticket_no}
                      </p>
                      <a
                        href={activeTicket.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline pt-1"
                      >
                        View Full Resolution
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Remark Box */}
              {activeTicket.admin_remarks ? (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                    Official Administrator Resolution Remarks
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    "{activeTicket.admin_remarks}"
                  </p>
                  <p className="text-[10px] text-emerald-600 pt-1">Updated at: {activeTicket.updated_at}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>The administration has received this grievance and is reviewing maintenance schedules.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <p className="text-xs">Select a grievance ticket from the list to view its complete tracking details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
