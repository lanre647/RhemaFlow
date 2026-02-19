import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, TrendingUp, ArrowRight, Search } from 'lucide-react';
import { getTranscripts } from '../lib/api';

export default function DashboardHome() {
  const [recentTranscripts, setRecent] = useState<any[]>([]);
  const [totalQuotes, setTotalQuotes] = useState(0);

  useEffect(() => {
    getTranscripts()
      .then((list) => {
        setRecent(list.slice(0, 5));
        setTotalQuotes(list.reduce((sum: number, t: any) => sum + (t.quotes?.length || 0), 0));
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: 'Total Transcripts', value: String(recentTranscripts.length), icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { label: 'Quotes Extracted', value: String(totalQuotes), icon: TrendingUp, color: 'bg-lime/10 text-dark' },
  ];
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-heading font-black text-dark text-xl sm:text-2xl tracking-tight">
          Good morning, John
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Here's what's happening with your transcriptions.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/dashboard/upload"
          className="group flex items-center gap-3 sm:gap-4 bg-dark text-offwhite rounded-2xl p-4 sm:p-6 hover:bg-dark/90 transition-colors overflow-hidden"
        >
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-lime/20 flex items-center justify-center flex-shrink-0">
            <Upload className="w-5 sm:w-6 h-5 sm:h-6 text-lime" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">Upload new sermon</p>
            <p className="text-offwhite/60 text-xs mt-0.5 truncate">MP3, M4A, WAV • Up to 2 hours</p>
          </div>
          <ArrowRight className="w-5 h-5 text-offwhite/40 group-hover:text-lime group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
        <Link
          to="/dashboard/library"
          className="group flex items-center gap-3 sm:gap-4 bg-white border border-border rounded-2xl p-4 sm:p-6 hover:border-lime/50 transition-colors overflow-hidden"
        >
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-offwhite flex items-center justify-center flex-shrink-0">
            <Search className="w-5 sm:w-6 h-5 sm:h-6 text-text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-dark text-sm truncate">Browse library</p>
            <p className="text-text-secondary text-xs mt-0.5 truncate">Search & organize your transcripts</p>
          </div>
          <ArrowRight className="w-5 h-5 text-text-secondary/40 group-hover:text-dark group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-border rounded-2xl p-3.5 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading font-black text-dark text-xl sm:text-2xl">{stat.value}</p>
            <p className="text-text-secondary text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent transcripts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-dark text-lg">Recent transcripts</h2>
          <Link to="/dashboard/transcripts" className="text-sm text-text-secondary hover:text-dark flex items-center gap-1 transition-colors">
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {recentTranscripts.map((transcript) => (
            <Link
              key={transcript.id}
              to={`/dashboard/transcripts/${transcript.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-offwhite/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-offwhite flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark truncate">{transcript.title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{transcript.date} • {transcript.duration}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  transcript.status === 'completed'
                    ? 'bg-lime/15 text-dark'
                    : 'bg-orange-50 text-orange-600'
                }`}
              >
                {transcript.status === 'completed' ? 'Completed' : 'Processing'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
