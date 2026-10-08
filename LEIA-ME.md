# Daniela Lina Terapia Integrativa — manual do site

Site de uma página, responsivo, pronto para publicar. Feito no mesmo padrão do
projeto anterior (estrutura, tipografia, espaçamentos e animações).

**WhatsApp usado em todo o site:** `5511961147268`

---

## 1. O que vem neste pacote

```
index.html              ← o site (versão em vários arquivos)
css/style.css           ← todos os estilos e as cores da marca
css/fonts.css           ← fontes locais (Fraunces e Manrope)
fonts/*.woff2           ← arquivos de fonte (nenhum CDN)
js/main.js              ← animações, menu, dúvidas, formulário
js/vendor/*.js          ← GSAP, ScrollTrigger, SplitText e Lenis (locais)
img/                    ← logotipo, fotos e ícones
img/originais/          ← as 4 imagens geradas em tamanho cheio (não vai no ZIP)
arquivo-unico/index.html ← ARQUIVO ÚNICO, autossuficiente (use este no Netlify)
arquivo-unico/og.jpg     ← imagem de compartilhamento
LEIA-ME.md              ← este arquivo
```

Nada depende da internet: fontes, bibliotecas e imagens são arquivos locais.

---

## 2. Publicando no Netlify (duas formas)

### Forma A — recomendada: arrastar o arquivo único

1. Abra **https://app.netlify.com/drop** no computador.
2. Arraste **somente** o arquivo `arquivo-unico/index.html` para a área indicada.
3. Prontinho. O Netlify gera um endereço como `nome-aleatorio.netlify.app`.

> O `og.jpg` (imagem de compartilhamento) fica ao lado do `index.html`.
> Se quiser que ele funcione, suba a **pasta** `arquivo-unico` inteira — ou,
> depois de publicar, troque `img/og.jpg` no código pelo endereço completo
> da imagem (ex.: `https://seudominio.netlify.app/og.jpg`).

**Por que existe um arquivo único?** Ao publicar pelo iPhone/Safari, o Netlify
às vezes recusa o ZIP com vários arquivos ("This doesn't appear to be a valid
zip archive"), mesmo o ZIP estando íntegro. O arquivo único não tem esse
problema: é só arrastar um arquivo.

### Forma B — o ZIP com vários arquivos

1. Abra **https://app.netlify.com/drop**.
2. Arraste o arquivo `daniela-lina-terapia-integrativa.zip`.
3. Se o Netlify reclamar, use a Forma A.

---

## 3. Onde editar cada texto

Tudo está em `index.html`, em ordem de aparição. Procure pelos comentários
`<!-- ===== NOME DA SEÇÃO ===== -->`.

| Seção | O que está escrito |
|---|---|
| **Início** | título, frase de abertura e os dois botões |
| **Você se reconhece?** | as 6 frases de dor + o aviso importante (veja o item 9 abaixo) |
| **Manifesto** | frase grande logo depois |
| **Como funciona** | os 3 passos (1º contato, conversa inicial, combinamos) |
| **Atendimentos** | 3 cartões + cartão de citação + cartão de chamada |
| **Sobre Daniela** | foto, texto curto e os 4 selos (chips) |
| **Dúvidas frequentes** | 5 perguntas — abra e edite à vontade |
| **Contato** | título, botões e o formulário |
| **Rodapé** | nome e ano |

Para trocar uma imagem, substitua o arquivo em `img/` **mantendo o mesmo nome**
(`hero`, `presencial`, `online`, `palestras`, `sobre`, `logo`).

---

## 4. Cores da marca

Todas ficam no começo de `css/style.css`. Foram extraídas do seu logotipo:

| Nome | Valor | Uso |
|---|---|---|
| `--roxo` | `#6745AC` | cor do fundo do logo, títulos, detalhes |
| `--roxo-escuro` | `#533585` | hover |
| `--roxo-medio` | `#8563C8` | gradientes, detalhes |
| `--lilas` | `#E8E0F6` | faixas e selos |
| `--lilas-suave` | `#F5F1FC` | fundos alternados |
| `--tinta` | `#2C1A4D` | texto principal |

---

## 5. Formulário: como funciona

A pessoa preenche **nome, WhatsApp, formato preferido, dias/horários** e,
se quiser, uma mensagem curta. Ao clicar em **"Montar minha mensagem"**:

1. os campos são validados (com recados de erro claros, em vermelho);
2. aparece um bloco com a **mensagem pronta para ela revisar e editar**;
3. ela clica em **"Enviar pelo WhatsApp"** e a mensagem sai do WhatsApp dela.

⚠️ **Nada é salvo neste site.** Não existe banco de dados nem integração — o
site só monta o texto e abre o WhatsApp. Isso está escrito para a pessoa no
próprio formulário, e é uma exigência de honestidade: nunca diga que o dado
foi registrado.

O formulário **não pede** diagnóstico, histórico clínico nem relatos
sensíveis — e avisa a pessoa para não enviar esse tipo de informação.

---

## 6. Acessibilidade e testes

Verificado automaticamente em 1440, 1280, 768 e 390 px de largura:

- zero rolagem horizontal em qualquer tamanho de tela;
- zero erro de console e zero requisição falhando;
- **zero falha de contraste** (todos os textos passam no nível AA do WCAG);
- abertura do site termina em **≈1,1 segundo** e nunca bloqueia o conteúdo;
- respeita `prefers-reduced-motion` (quem pede menos movimento não vê animação);
- com o JavaScript desligado, todo o conteúdo continua legível;
- navegação completa pelo teclado;
- o carrossel de atendimentos rola com o dedo no celular e com a roda no
  computador (também aceita as setas do teclado).

---

## 7. ⚠️ O que ainda precisa da sua confirmação

**Nada abaixo foi inventado.** O site foi escrito exatamente para não precisar
dizer o que não se sabe — mas, assim que você confirmar, é só preencher:

### 7.1 Informações que faltam

| # | Item | Onde entra | Como o site está hoje |
|---|---|---|---|
| 1 | **Formação e registro profissional** (conselho e número, se houver) | Sobre Daniela | Texto neutro, sem credenciais. Já existe um trecho pronto, comentado no `index.html`, é só descomentar e preencher |
| 2 | **Endereço / local do atendimento presencial** (bairro e cidade) | Cartão 01 e Dúvidas | Diz que o endereço é combinado no contato |
| 3 | **Plataforma do atendimento online** (Google Meet, Zoom, WhatsApp…) | Cartão 02 e Dúvidas | Diz que o link e a plataforma são combinados no contato — **nenhuma plataforma foi citada** |
| 4 | **Duração da sessão e valores** | — | O site não cita preço nem duração |
| 5 | **Dias e horários de atendimento** | — | O site combina isso na conversa |
| 6 | **Instagram ou outros contatos** | Rodapé | Só o WhatsApp |
| 7 | **Palestras**: temas, formatos e para quem | Cartão 03 | Diz apenas que você faz palestras e que os temas são conversados |
| 8 | **Um parágrafo a mais sobre você** (se quiser) | Sobre Daniela | Texto curto de duas linhas |
| 9 | **Endereço final do site** (domínio) | `<link rel="canonical">` e imagem de compartilhamento | Deixei um comentário no `index.html` mostrando onde colocar |

### 7.2 Sobre as imagens

| Lugar no site | O que é hoje |
|---|---|
| **Início (hero)** | **foto real sua**, `IMG_3160` (corte 4:5, mantendo o topo) |
| **Sobre Daniela** | **foto real sua**, `IMG_3187` (corte 2:3) |
| Atendimento presencial | ilustração gerada por computador |
| Atendimento online | ilustração gerada por computador |
| Palestras | ilustração gerada por computador |

As 3 ilustrações **não são** fotos de sessões reais e não aparecem no site como
depoimento, prova de resultado ou registro de atendimento — são apenas imagens
de apoio para ilustrar cada formato.

As fotos originais estão guardadas em `img/originais/` (essa pasta não vai para
o site). Se quiser outro corte do retrato do início, o arquivo é
`img/originais/hero-real-IMG_3160.png` (1024×1536).

Para trocar qualquer imagem: substitua o arquivo em `img/` **mantendo o mesmo
nome** (`hero`, `presencial`, `online`, `palestras`, `sobre`, `logo`).

### 7.3 Sobre a linguagem das dores (seção "Você se reconhece?")

A sua observação foi uma das mais importantes do projeto: o site precisava
**dizer com clareza o que você faz** e **falar direto da dor**, na língua de
quem está sofrendo — e não em termos bonitos que ninguém usa no dia a dia.

Então o site agora nomeia, logo na abertura: **ansiedade, tristeza que não
passa, conflitos internos, sobrecarga do dia a dia** — e a seção seguinte
mostra 6 frases em que a pessoa se reconhece na hora.

**O que foi feito com cuidado, de propósito:**

- as dores são descritas como **experiências** ("a tristeza já dura demais",
  "a cabeça não para"), e **não como diagnósticos** — o site não diz que você
  trata depressão, transtorno de ansiedade nem nenhuma condição específica;
- logo abaixo das 6 frases existe um **aviso em caixa tracejada** afirmando que
  a terapia integrativa não substitui acompanhamento médico ou psiquiátrico e
  **não promete cura nem resultados**. ⚠️ **Não remova esse aviso** — ele
  protege você e passa mais confiança, não menos;
- o texto é escrito de forma **neutra** (sem "sozinho/sozinha", "escutado/
  escutada"), para valer igual para qualquer pessoa;
- nada de promessa: em nenhum lugar o site diz que a pessoa vai "melhorar",
  "se curar" ou "resolver" alguma coisa.

Se você quiser citar alguma abordagem específica (EMDR, constelação, florais,
Radiestesia, etc.), me avise qual — aí incluímos **com a sua confirmação**,
porque não invento nada sobre a sua formação.

### 7.4 O que foi deliberadamente evitado

- promessa de cura, melhora ou resultado;
- diagnósticos: o site fala de experiências (ansiedade, tristeza, sobrecarga),
  nunca de doenças;
- citação de técnicas específicas sem sua confirmação;
- número de registro, formação, cursos ou especialidades não confirmados;
- contagem de pacientes, anos de experiência ou depoimentos;
- preço, duração de sessão, endereço, plataforma ou horário;
- qualquer menção a Home Care, cuidado de idosos ou procedimentos.

---

## 8. Arquivos gerados neste projeto

- `daniela-lina-terapia-integrativa.zip` — 2,16 MB, 32 arquivos (site completo)
- `arquivo-unico/index.html` — 976 KB, arquivo único para o Netlify Drop
- `imagens-terapia.html` (fora desta pasta) — folha de contato comparando as
  4 imagens geradas com as suas fotos originais
