const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzQ4MTMsImV4cCI6MjA4MDIxMDgxM30.qdhuXiczy3sxbPiAaMP1O0seSnIg9FC27TKYPCM9nr8';

console.log('Testing connection to:', supabaseUrl);

async function testConnection() {
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const start = Date.now();
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        const end = Date.now();

        if (error) {
            console.error('❌ Connection Failed:', error.message);
            console.error('Full Error:', JSON.stringify(error, null, 2));
        } else {
            console.log('✅ Connection Successful!');
            console.log(`Time taken: ${end - start}ms`);
            console.log('Data received:', data);
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
        if (err.cause) console.error('Cause:', err.cause);
    }
}

testConnection();
