
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYzNDgxMywiZXhwIjoyMDgwMjEwODEzfQ.l3U4R2P7uwd5_PleQDXhB4Aq20n-28rB0J1magLPbNA';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function setAdmin() {
    const email = 'thalesbx@gmail.com';
    console.log(`🔍 Buscando usuário: ${email}...`);

    // 1. Buscar ID do usuário no Auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error('❌ Erro ao listar usuários:', authError);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('❌ Usuário não encontrado no Auth! Faça cadastro primeiro.');
        return;
    }

    console.log(`✅ Usuário encontrado: ${user.id}`);

    // 2. Atualizar tabela profiles
    console.log('🔄 Atualizando permissões de admin...');

    const { data, error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', user.id)
        .select();

    if (error) {
        console.error('❌ Erro ao atualizar profile:', error);
    } else {
        console.log('✅ SUCESSO! Usuário agora é ADMIN.');
        console.log('Dados atualizados:', data);
    }
}

setAdmin();
