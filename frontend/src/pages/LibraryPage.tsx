import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Filter, Clock, MoreHorizontal, Trash2, Download, Share2 } from 'lucide-react';
import { getTranscripts, deleteTranscript } from '../lib/api';

interface Quote {
  id: string;
  text: string;
  timestamp?: string;
}

interface Transcript {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  tags: string[];
  quotes: Quote[];
  status: string;
}

export default function LibraryPage() {
  const [allTranscripts, setAllTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const list = await getTranscripts();
      setAllTranscripts(list as unknown as Transcript[]);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transcript?')) return;
    try {
      await deleteTranscript(id);
      setAllTranscripts((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // Handle error silently
    }
    setOpenMenu(null);
  };

  const allTags = [...new Set(allTranscripts.flatMap((t) => t.tags))];

  const filtered = allTranscripts.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.speaker.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || t.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-dark text-xl sm:text-2xl tracking-tight">Library</h1>
          <p className="text-text-secondary text-sm mt-1">
            {loading ? '...' : `${allTranscripts.length} transcripts`}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transcripts..."
            className="w-full sm:w-[280px] h-10 rounded-xl border border-border bg-white pl-9 pr-4 text-sm text-dark placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Tags filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-text-secondary" />
        <button
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !activeTag ? 'bg-dark text-offwhite' : 'bg-offwhite text-text-secondary hover:bg-border'
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTag === tag ? 'bg-lime text-dark' : 'bg-offwhite text-text-secondary hover:bg-border'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Transcript list */}
      <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="w-10 h-10 text-text-secondary/30 mx-auto mb-3" />
            <p className="text-sm text-text-secondary">No transcripts found</p>
          </div>
        ) : (
          filtered.map((transcript) => (
            <div
              key={transcript.id}
              className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 hover:bg-offwhite/50 transition-colors group"
            >
              <Link
                to={`/dashboard/transcripts/${transcript.id}`}
                className="flex items-center gap-4 flex-1 min-w-0"
              >
                <div className="w-10 h-10 rounded-xl bg-offwhite flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">{transcript.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-secondary">{transcript.speaker}</span>
                    <span className="text-xs text-text-secondary/40">•</span>
                    <span className="text-xs text-text-secondary">{transcript.date}</span>
                    <span className="text-xs text-text-secondary/40">•</span>
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {transcript.duration}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5">
                  {transcript.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-offwhite rounded-full text-[10px] font-medium text-text-secondary">
                      #{tag}
                    </span>
                  ))}
                </div>

                <span className="hidden md:block text-xs text-text-secondary font-medium">
                  {transcript.quotes?.length || 0} quotes
                </span>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    transcript.status === 'completed'
                      ? 'bg-lime/15 text-dark'
                      : 'bg-orange-50 text-orange-600'
                  }`}
                >
                  {transcript.status}
                </span>

                {/* Actions menu */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === transcript.id ? null : transcript.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-border transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4 text-text-secondary" />
                  </button>
                  {openMenu === transcript.id && (
                    <div className="absolute right-0 top-10 w-44 bg-white border border-border rounded-xl shadow-lg py-1.5 z-20">
                      <button className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-dark hover:bg-offwhite w-full text-left">
                        <Download className="w-4 h-4 text-text-secondary" /> Download
                      </button>
                      <button className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-dark hover:bg-offwhite w-full text-left">
                        <Share2 className="w-4 h-4 text-text-secondary" /> Share
                      </button>
                      <div className="h-px bg-border my-1" />
                      <button
                        onClick={() => handleDelete(transcript.id)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
