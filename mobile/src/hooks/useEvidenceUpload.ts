import { supabase } from '../lib/supabase';

const BUCKET = 'evidence';

export function useEvidenceUpload() {
  const upload = async (file: File, journalEntryId?: string): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return null;

    const ext  = file.name.split('.').pop() ?? 'bin';
    const path = `${userId}/${journalEntryId ?? 'general'}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

    if (error) return null;

    if (journalEntryId) {
      await supabase.from('evidence_files').insert({
        user_id:          userId,
        journal_entry_id: journalEntryId,
        storage_path:     path,
        file_name:        file.name,
        mime_type:        file.type,
        file_size:        file.size,
      });
    }

    return path;
  };

  const getUrl = async (path: string): Promise<string | null> => {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
  };

  return { upload, getUrl };
}
