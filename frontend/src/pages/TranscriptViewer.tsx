import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Copy,
  Share2,
  Download,
  Clock,
  User,
  Calendar,
  ChevronRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { getTranscript, extractQuotes } from '../lib/api';

interface Quote {
  text: string;
  timestamp: string;
  speaker: string;
  themes: string[];
  impact: number;
}

interface TranscriptData {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  tags: string[];
  transcript: string;
  quotes: Quote[];
  status: string;
}

interface TranscriptResponse {
  id?: string;
  title?: string;
  speaker?: string;
  date?: string;
  createdAt?: string;
  duration?: string;
  tags?: string;
  transcript?: string;
  quotes?: Quote[];
  status?: string;
}

interface ApiQuote {
  text?: string;
  timestamp?: string | number;
  speaker?: string;
  themes?: string[];
  impact?: number;
}

export default function TranscriptViewer() {
  const params = useParams();
  const id = params.id!;
  const [data, setData] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTranscript(id)
      .then((t: TranscriptResponse) => {
        const transcriptData: TranscriptData = {
          id: t.id || '',
          title: t.title || '',
          speaker: t.speaker || '',
          date: t.date || t.createdAt || '',
          duration: t.duration || '',
          tags: t.tags ? [t.tags] : [],
          transcript: t.transcript || '',
          quotes: t.quotes || [],
          status: t.status || 'completed',
        };
        setData(transcriptData);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleExtractQuotes = async () => {
    setExtracting(true);
    try {
      const apiQuotes = await extractQuotes(id);
      const quotes: Quote[] = apiQuotes.map((q: ApiQuote) => ({
        text: q.text || '',
        timestamp: String(q.timestamp || ''),
        speaker: q.speaker || '',
        themes: q.themes || [],
        impact: q.impact || 0,
      }));
      setData((prev) => prev ? { ...prev, quotes } : prev);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to extract quotes');
    } finally {
      setExtracting(false);
    }
  };

  const copyText = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(String(index));
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Parse transcript text into lines by splitting on timestamps or paragraphs
  const transcriptLines = data?.transcript
    ? data.transcript.split('\n').filter((line) => line.trim())
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-text-secondary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-text-secondary">{error || 'Transcript not found'}</p>
        <Link to="/dashboard/library" className="text-sm text-dark font-medium mt-4 inline-block hover:underline">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back & Header */}
      <div>
        <Link
          to="/dashboard/library"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-dark transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="font-heading font-black text-dark text-lg sm:text-2xl tracking-tight">
              {data.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-text-secondary flex-wrap">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{data.speaker}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{data.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{data.duration}</span>
            </div>
            <div className="flex gap-1.5 mt-3">
              {data.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 bg-offwhite rounded-full text-xs font-medium text-text-secondary">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="h-9 px-4 rounded-xl bg-offwhite text-sm font-medium text-dark hover:bg-border transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="h-9 px-4 rounded-xl bg-offwhite text-sm font-medium text-dark hover:bg-border transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Audio player bar */}
      <div className="bg-dark text-offwhite rounded-2xl px-5 py-3.5 flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-lime flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-dark" />
          ) : (
            <Play className="w-4 h-4 text-dark ml-0.5" />
          )}
        </button>
        <div className="flex-1">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-lime rounded-full w-[15%] transition-all" />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/50">0:00</span>
            <span className="text-[10px] text-white/50">{data.duration}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Transcript body */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dark">Full Transcript</h2>
            <span className="text-xs text-text-secondary">{transcriptLines.length} paragraphs</span>
          </div>
          <div className="divide-y divide-border/50">
            {transcriptLines.map((line, i) => (
              <div
                key={i}
                className="flex gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-3.5 group hover:bg-offwhite/50 transition-colors"
              >
                <span className="text-[11px] text-text-secondary/60 font-mono w-6 pt-0.5 flex-shrink-0 hidden sm:block">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark leading-relaxed">{line}</p>
                </div>
                <div className="flex items-start gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => copyText(i, line)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-border transition-colors"
                    title="Copy text"
                  >
                    <Copy className={`w-3.5 h-3.5 ${copiedId === String(i) ? 'text-lime' : 'text-text-secondary'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Quotes sidebar */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden h-fit lg:sticky lg:top-6">
          <div className="px-5 py-3.5 border-b border-border">
            <h2 className="text-sm font-semibold text-dark flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-lime" /> AI-Extracted Quotes
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {data.quotes.length > 0 ? `${data.quotes.length} quotes found` : 'Powered by Google Gemini'}
            </p>
          </div>

          {data.quotes.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Sparkles className="w-8 h-8 text-text-secondary/20 mx-auto mb-2" />
              <p className="text-xs text-text-secondary mb-4">
                Let Gemini AI analyze this transcript and extract the most impactful quotes.
              </p>
              <button
                onClick={handleExtractQuotes}
                disabled={extracting}
                className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-lime text-dark text-xs font-semibold hover:brightness-95 transition-all disabled:opacity-50"
              >
                {extracting ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Extracting...</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5" /> Extract Quotes</>
                )}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border/50 max-h-[480px] overflow-y-auto">
              {data.quotes.map((q, i) => (
                <div key={i} className="px-5 py-3 hover:bg-offwhite/50 transition-colors">
                  <p className="text-xs text-dark leading-relaxed line-clamp-4">"{q.text}"</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {q.timestamp && (
                      <span className="text-[10px] text-text-secondary">{q.timestamp}</span>
                    )}
                    {q.themes?.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 bg-lime/10 rounded text-dark/60">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <div
                        key={s}
                        className={`w-1.5 h-1.5 rounded-full ${s < q.impact ? 'bg-lime' : 'bg-border'}`}
                      />
                    ))}
                    <span className="text-[9px] text-text-secondary ml-1">impact</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.quotes.length > 0 && (
            <div className="px-5 py-3 border-t border-border space-y-2">
              <button
                onClick={handleExtractQuotes}
                disabled={extracting}
                className="w-full h-8 rounded-xl bg-offwhite text-dark text-xs font-medium hover:bg-border transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {extracting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Re-extract
              </button>
              <button className="w-full h-9 rounded-xl bg-lime text-dark text-xs font-semibold hover:brightness-95 transition-all flex items-center justify-center gap-1.5">
                Export Quotes <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
