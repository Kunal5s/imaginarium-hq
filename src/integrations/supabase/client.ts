
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xshpzepvseuqjeakcmwi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaHB6ZXB2c2V1cWplYWtjbXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NjY1MDksImV4cCI6MjA1NjU0MjUwOX0.RL4KN4gmEZSBhas8jdJucIgJGa_lVyVhXS94eKfuLi8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
