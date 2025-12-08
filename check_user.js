const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYzNDgxMywiZXhwIjoyMDgwMjEwODEzfQ.l3U4R2P7uwd5_PleQDXhB4Aq20n-28rB0J1magLPbNA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser() {
    const email = 'thalesbx@gmail.com';
    console.log(`🔍 Verificando usuário: ${email}...`);

    // 1. Listar todos os usuários
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('❌ Erro ao listar usuários:', error);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('❌ Usuário NÃO EXISTE no Supabase Auth!');
        console.log('💡 Você precisa criar uma conta primeiro.');
        return;
    }

    console.log('✅ Usuário EXISTE no Auth:');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Email confirmado:', user.email_confirmed_at ? 'SIM' : 'NÃO');
    console.log('Criado em:', user.created_at);
    console.log('Último login:', user.last_sign_in_at || 'Nunca');

    // 2. Verificar profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    console.log('\n📋 Dados do Profile:');
    console.log(profile);
}

checkUser();
