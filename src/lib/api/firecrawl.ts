import { supabase } from '@/integrations/supabase/client';

type FirecrawlResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
};

type SearchOptions = {
  limit?: number;
  lang?: string;
  country?: string;
  tbs?: string;
  scrapeOptions?: { formats?: ('markdown' | 'html')[] };
};

export const firecrawlApi = {
  async search(query: string, options?: SearchOptions): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-search', {
      body: { query, options },
    });

    console.log('[firecrawl] invoke result:', { data, error });

    if (error) {
      // Try to extract the real error from the function response
      let detail = error.message;
      try {
        const ctx: any = (error as any).context;
        if (ctx?.body) {
          const parsed = typeof ctx.body === 'string' ? JSON.parse(ctx.body) : ctx.body;
          if (parsed?.error) detail = parsed.error;
        }
      } catch {}
      return { success: false, error: detail };
    }

    // Firecrawl returns { success, data } directly — normalize
    if (data && typeof data === 'object' && 'data' in data) {
      return { success: true, data: (data as any).data };
    }
    return data;
  },
};
