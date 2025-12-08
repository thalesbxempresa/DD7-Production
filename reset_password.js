const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYzNDgxMywiZXhwIjoyMDgwMjEwODEzfQ.l3U4R2P7uwd5_PleQDXhB4Aq20n-28rB0J1magLPbNA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetPassword() {
    const email = 'thalesbx@gmail.com';
    const newPassword = 'Admin123!'; // Senha temporária

    console.log(`🔄 Resetando senha para: ${email}...`);

    const { data, error } = await supabase.auth.admin.updateUserById(
        'f386544f-1e3d-4e63-83f7-af83c12dbaeb',
        {
            password: newPassword,
            email_confirm: true // Confirma o email automaticamente
        }
    );

    if (error) {
        console.error('❌ Erro:', error);
        return;
    }

    console.log('✅ SUCESSO!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Senha temporária: ${newPassword}`);
    console.log('💡 Faça login e depois troque a senha nas configurações!');
}

resetPassword();
