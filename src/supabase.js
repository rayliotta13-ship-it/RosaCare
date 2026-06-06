import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nodtxwkzzgxmhilvtmxq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TZUZ9ccTHfkh4qzlvA2LyA_k_mzz7N8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});