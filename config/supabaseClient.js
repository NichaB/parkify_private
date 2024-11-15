<<<<<<< HEAD
// config/supabaseClient.js
=======
/*import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase*/

// lib/supabaseClient.js
>>>>>>> origin/home
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

<<<<<<< HEAD
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
=======
export const supabase = createClient(supabaseUrl, supabaseKey);
>>>>>>> origin/home
