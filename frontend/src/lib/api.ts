const API_BASE = 'http://localhost:5000/api';

interface Transcript {
  id: string;
  text: string;
  title?: string;
  speaker?: string;
  tags?: string;
}

interface Quote {
  text: string;
  timestamp?: number;
  speaker?: string;
}

export async function uploadAndTranscribe(
  file: File,
  metadata: { title: string; speaker: string; tags: string },
  onProgress?: (pct: number) => void
): Promise<{ id: string; transcript: Transcript }> {
  const formData = new FormData();
  formData.append('audio', file);
  formData.append('title', metadata.title);
  formData.append('speaker', metadata.speaker);
  formData.append('tags', metadata.tags);

  // Use XMLHttpRequest for upload progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({ id: data.id, transcript: data.transcript });
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.open('POST', `${API_BASE}/transcribe`);
    xhr.send(formData);
  });
}

export async function getTranscripts(): Promise<Transcript[]> {
  const res = await fetch(`${API_BASE}/transcripts`);
  if (!res.ok) throw new Error('Failed to fetch transcripts');
  return res.json();
}

export async function getTranscript(id: string): Promise<Transcript> {
  const res = await fetch(`${API_BASE}/transcripts/${id}`);
  if (!res.ok) throw new Error('Transcript not found');
  return res.json();
}

export async function extractQuotes(id: string): Promise<Quote[]> {
  const res = await fetch(`${API_BASE}/transcripts/${id}/extract-quotes`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Quote extraction failed' }));
    throw new Error(err.error);
  }
  const data = await res.json();
  return data.quotes;
}

export async function deleteTranscript(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/transcripts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete transcript');
}
