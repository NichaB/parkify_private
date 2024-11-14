<<<<<<< HEAD
// config/supabaseClient.js
=======

>>>>>>> login-developer
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

<<<<<<< HEAD
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
=======
export const supabase = createClient(supabaseUrl, supabaseKey);
>>>>>>> login-developer
