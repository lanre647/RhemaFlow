import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileAudio, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadAndTranscribe } from '../lib/api';

type UploadState = 'idle' | 'selected' | 'uploading' | 'processing' | 'done' | 'error';

export default function UploadPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<UploadState>('idle');
  const [transcriptId, setTranscriptId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const speakerRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setState('selected');
    setErrorMsg('');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setState('uploading');
    setProgress(0);
    setErrorMsg('');

    try {
      const metadata = {
        title: titleRef.current?.value || file.name.replace(/\.[^/.]+$/, ''),
        speaker: speakerRef.current?.value || '',
        tags: tagsRef.current?.value || '',
      };

      // Upload phase — progress tracked via XHR
      setState('uploading');
      const { id } = await uploadAndTranscribe(file, metadata, (pct) => {
        setProgress(pct);
        if (pct >= 100) setState('processing');
      });

      setTranscriptId(id);
      setState('done');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setFile(null);
    setProgress(0);
    setTranscriptId(null);
    setErrorMsg('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-black text-dark text-xl sm:text-2xl tracking-tight">
          Upload sermon
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Upload an audio or video file to transcribe. We support MP3, M4A, WAV, MP4, MOV, and WEBM.
        </p>
      </div>

      {state === 'idle' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            dragActive
              ? 'border-lime bg-lime/5'
              : 'border-border hover:border-text-secondary/30 hover:bg-offwhite/50'
          }`}
        >
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-offwhite flex items-center justify-center mb-5">
            <UploadIcon className="w-7 h-7 text-text-secondary" />
          </div>
          <p className="font-semibold text-dark text-sm">
            Drop your audio or video file here
          </p>
          <p className="text-text-secondary text-xs mt-1.5">
            or click to browse • MP3, M4A, WAV, MP4, MOV, WEBM
          </p>
        </div>
      )}

      {state === 'selected' && file && (
        <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center flex-shrink-0">
              <FileAudio className="w-6 h-6 text-dark" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark truncate">{file.name}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            <button
              onClick={reset}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-offwhite transition-colors"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-dark mb-1.5 block">Title</label>
              <input
                ref={titleRef}
                type="text"
                defaultValue={file.name.replace(/\.[^/.]+$/, '')}
                className="w-full h-10 rounded-xl border border-border bg-offwhite px-4 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-dark mb-1.5 block">Speaker (optional)</label>
              <input
                ref={speakerRef}
                type="text"
                placeholder="e.g. Pastor John"
                className="w-full h-10 rounded-xl border border-border bg-offwhite px-4 text-sm text-dark placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-dark mb-1.5 block">Tags (optional)</label>
              <input
                ref={tagsRef}
                type="text"
                placeholder="e.g. faith, sunday-service, romans"
                className="w-full h-10 rounded-xl border border-border bg-offwhite px-4 text-sm text-dark placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleUpload}
            className="w-full h-11 rounded-xl bg-lime text-dark font-semibold text-sm flex items-center justify-center gap-2 hover:bg-lime-dark transition-colors"
          >
            Start transcription
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {(state === 'uploading' || state === 'processing') && (
        <div className="bg-white border border-border rounded-2xl p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-lime/10 flex items-center justify-center">
            {state === 'uploading' ? (
              <UploadIcon className="w-7 h-7 text-dark" />
            ) : (
              <div className="w-7 h-7 border-3 border-lime/30 border-t-lime rounded-full animate-spin" />
            )}
          </div>
          <div>
            <p className="font-semibold text-dark text-sm">
              {state === 'uploading' ? 'Uploading...' : 'Transcribing...'}
            </p>
            <p className="text-text-secondary text-xs mt-1">
              {state === 'uploading'
                ? 'Please keep this tab open'
                : 'AI is processing your audio — this may take a few minutes'}
            </p>
          </div>
          {state === 'uploading' && (
            <div className="w-full max-w-xs mx-auto">
              <div className="h-2 bg-offwhite rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-2">{Math.min(Math.round(progress), 100)}%</p>
            </div>
          )}
        </div>
      )}

      {state === 'done' && (
        <div className="bg-white border border-border rounded-2xl p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-lime/15 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-lime-dark" />
          </div>
          <div>
            <p className="font-semibold text-dark text-lg">Transcription complete!</p>
            <p className="text-text-secondary text-sm mt-1">
              Your sermon has been transcribed and is ready to view.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/dashboard/transcripts/${transcriptId || '1'}`)}
              className="h-10 px-6 rounded-xl bg-lime text-dark font-semibold text-sm flex items-center gap-2 hover:bg-lime-dark transition-colors"
            >
              View transcript
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={reset}
              className="h-10 px-6 rounded-xl border border-border text-dark font-medium text-sm hover:bg-offwhite transition-colors"
            >
              Upload another
            </button>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-dark text-lg">Something went wrong</p>
            <p className="text-text-secondary text-sm mt-1">{errorMsg}</p>
          </div>
          <button
            onClick={reset}
            className="h-10 px-6 rounded-xl bg-dark text-offwhite font-semibold text-sm hover:bg-dark/90 transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
