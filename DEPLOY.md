# Guia de Acesso e Deploy

Existem duas formas de visualizar seu aplicativo no celular:

## 1. Acesso Local (Rápido - Apenas no seu Wi-Fi)
Se você quer apenas testar agora e seu celular está no mesmo Wi-Fi que o computador:

1.  Certifique-se que o servidor está rodando (`npm run dev`).
2.  No navegador do seu celular, digite:
    `http://192.168.18.69:3000`

> **Nota:** Se não carregar, pode ser necessário permitir o Node.js no Firewall do Windows ou rodar o comando:
> `npm run dev -- -H 0.0.0.0`

---

## 2. Colocar Online (Deploy Real - Acessível de qualquer lugar)
Para que qualquer pessoa possa acessar (ou você no 4G), recomendamos usar a **Vercel** (criadora do Next.js). É grátis e fácil.

### Passo 1: Preparar o Git
Seu projeto ainda não está conectado ao Git. Abra um **novo terminal** (mantenha o `npm run dev` rodando no outro) e rode:

```bash
git init
git add .
git commit -m "Primeira versão do app"
```

### Passo 2: Subir para o GitHub
1.  Crie uma conta no [GitHub.com](https://github.com) se não tiver.
2.  Crie um novo repositório (botão "New").
3.  Copie os comandos que o GitHub mostrar na seção **"…or push an existing repository from the command line"**. Eles parecem com isso:
    ```bash
    git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
    git branch -M main
    git push -u origin main
    ```
4.  Cole e rode esses comandos no seu terminal.

### Passo 3: Conectar na Vercel
1.  Crie uma conta na [Vercel.com](https://vercel.com) (faça login com o GitHub).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Importe o repositório que você acabou de criar no GitHub.
4.  Nas configurações de "Environment Variables", adicione as chaves do seu Supabase (as mesmas do arquivo `.env.local`):
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5.  Clique em **Deploy**.

Em alguns minutos, você terá um link (ex: `seu-app.vercel.app`) para abrir em qualquer lugar!
