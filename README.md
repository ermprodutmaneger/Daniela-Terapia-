# Daniela Lina Terapia Integrativa

Site de uma página, responsivo, para a terapeuta integrativa Daniela Lina.
Feito em HTML, CSS e JavaScript puro — sem frameworks, sem banco de dados e sem
nenhuma dependência externa (as fontes e as bibliotecas de animação estão todas
na pasta).

## Como publicar no GitHub Pages

1. Crie um repositório e suba **o conteúdo desta pasta** (é só arrastar os
   arquivos e as pastas para a área de upload do GitHub).
2. Vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**.
4. Em **Branch**, escolha **main** e a pasta **/ (root)**. Salve.
5. Espere 1 ou 2 minutos. O site fica em:

   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

O arquivo `.nojekyll` já está aqui: ele faz o GitHub servir os arquivos como
estão, sem processamento extra.

## O que tem em cada pasta

```
index.html      a página inteira
css/            estilos e fontes
fonts/          Fraunces e Manrope (arquivos locais)
js/             animações, menu, dúvidas e formulário
js/vendor/      GSAP, ScrollTrigger, SplitText e Lenis (locais)
img/            logotipo, fotos e ícones
img/originais/  fotos originais em alta resolução (não é necessária no site)
```

## Sobre o formulário

Ele **não salva nada**. A pessoa preenche, revisa a mensagem e o site abre o
WhatsApp dela com o texto pronto. Não existe servidor, integração nem banco de
dados — por isso não há o que configurar.

O WhatsApp de destino está em `js/main.js` e nos links do `index.html`:
procure por `5511961147268` para trocar, se um dia for preciso.

## O que ainda precisa de confirmação da Daniela

Está tudo listado no `LEIA-ME.md`, na seção 7. Resumo: formação e registro
profissional, endereço do atendimento presencial, plataforma do online, valores
e duração da sessão, dias e horários, outros contatos e os temas das palestras.
