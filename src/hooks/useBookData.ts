import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const BOOKS_BUCKET = 'books';

export interface BookData {
  slug: string;
  file_url: string;
  title: string;
}

const generateSlug = (filename: string): string =>
  filename
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

export const useBookData = (slug: string | undefined, fileParam: string | null) => {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setPdfUrl(null);
      setBookData(null);

      try {
        let resolvedUrl: string | null = null;

        if (slug) {
          const { data, error: dbError } = await supabase
            .from('books')
            .select('*')
            .eq('slug', slug)
            .single();

          if (cancelled) return;

          if (data && !dbError) {
            setBookData(data);
            resolvedUrl = data.file_url;
          } else {
            // Construct URL from slug and check if file exists
            const potentialFileName =
              slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) + '.pdf';
            const constructedUrl = supabase.storage
              .from(BOOKS_BUCKET)
              .getPublicUrl(potentialFileName).data.publicUrl;

            abortControllerRef.current = new AbortController();
            try {
              const response = await fetch(constructedUrl, {
                method: 'HEAD',
                signal: abortControllerRef.current.signal,
              });

              if (cancelled) return;

              if (response.ok) {
                const newBook: BookData = {
                  slug,
                  file_url: constructedUrl,
                  title: potentialFileName.replace('.pdf', ''),
                };
                setBookData(newBook);
                resolvedUrl = constructedUrl;
                // Save to DB for future use (fire and forget)
                supabase.from('books').insert(newBook).select().single().then(null, console.warn);
              } else {
                throw new Error(`Book with slug "${slug}" not found`);
              }
            } catch (fetchError) {
              if (fetchError instanceof Error && fetchError.name === 'AbortError') return;
              throw fetchError;
            }
          }
        } else if (fileParam) {
          const url = new URL(fileParam);
          const filename = url.pathname.split('/').pop() ?? 'Unknown Book';
          const title = filename.replace('.pdf', '');
          const generatedSlug = generateSlug(filename);

          const newBook: BookData = { slug: generatedSlug, file_url: fileParam, title };
          if (cancelled) return;
          setBookData(newBook);
          resolvedUrl = fileParam;
          // Save to DB (fire and forget)
          supabase
            .from('books')
            .upsert(newBook, { onConflict: 'slug' })
            .then(null, console.warn);
        } else {
          throw new Error('No book specified. Please provide either a slug or file parameter.');
        }

        if (!cancelled) setPdfUrl(resolvedUrl);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load book data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, fileParam]);

  return { bookData, pdfUrl, loading, error };
};
