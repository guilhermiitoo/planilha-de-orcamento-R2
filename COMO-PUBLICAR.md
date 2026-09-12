# Como publicar no GitHub + Netlify

## 1. Antes de subir
Confirme que os quadros do vídeo estão em `assets/residencial/quadros/`
e que `content.js` tem o número certo em `cena.quadros.total`.
Se a pasta estiver vazia, o site funciona mesmo assim — usa as fotos.

## 2. GitHub
1. Crie uma conta em github.com (se ainda não tiver).
2. Clique em **New repository**. Nome: `r2-energy`. Deixe **Public**. Crie.
3. Na tela seguinte, clique em **uploading an existing file**.
4. Arraste TODOS os arquivos e pastas deste projeto (index.html, styles.css,
   app.js, content.js, scene.js, netlify.toml e a pasta assets inteira).
   ⚠️ Arraste o CONTEÚDO da pasta, não a pasta r2-energy em si.
5. Escreva qualquer coisa em "Commit changes" e confirme.

## 3. Netlify
1. Crie uma conta em netlify.com usando **Sign up with GitHub**.
2. **Add new site → Import an existing project → GitHub**.
3. Autorize e escolha o repositório `r2-energy`.
4. Deixe "Build command" vazio e "Publish directory" como `.`. Clique em **Deploy**.
5. Em um minuto o site está no ar num endereço tipo `nome-aleatorio.netlify.app`.
   Em **Site settings → Change site name** você troca para algo como `r2energy`.

## 4. Depois
Qualquer alteração que você subir no GitHub é publicada sozinha no Netlify,
em cerca de um minuto. Não precisa repetir o processo.

## Domínio próprio (opcional)
Se a R2 tiver um domínio (ex.: r2energy.com.br), em **Domain settings → Add a
domain** o Netlify mostra quais registros apontar no painel do domínio.
