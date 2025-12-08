const { createClient } = require('@supabase/supabase-js')

// CONFIGURAÇÃO - Substitua com seus dados
const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYzNDgxMywiZXhwIjoyMDgwMjEwODEzfQ.l3U4R2P7uwd5_PleQDXhB4Aq20n-28rB0J1magLPbNA'

const email = 'seuemail@exemplo.com' // <<<< SUBSTITUA AQUI
const newPassword = 'SenhaNova123!' // <<<< SUBSTITUA AQUI

// =====================================================

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function resetPassword() {
    console.log(`🔍 Buscando usuário: ${email}...`)

    // Buscar todos os usuários
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
        console.error('❌ Erro ao listar usuários:', listError)
        return
    }

    // Encontrar usuário pelo email
    const user = users.find(u => u.email === email)

    if (!user) {
        console.error(`❌ Usuário com email "${email}" não encontrado!`)
        console.log('\n📝 Usuários disponíveis:')
        users.forEach(u => console.log(`  - ${u.email}`))
        return
    }

    console.log(`✅ Usuário encontrado: ID ${user.id}`)
    console.log(`📧 Email: ${user.email}`)
    console.log(`🔄 Atualizando senha...`)

    // Atualizar senha do usuário
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
    )

    if (error) {
        console.error('❌ Erro ao atualizar senha:', error)
    } else {
        console.log('\n✅ SENHA ATUALIZADA COM SUCESSO!')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`📧 Email: ${email}`)
        console.log(`🔑 Nova senha: ${newPassword}`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('\n💡 O usuário já pode fazer login com a nova senha!')
    }
}

resetPassword()
