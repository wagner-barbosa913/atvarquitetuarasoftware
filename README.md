# E-commerce — Padrões Criacionais

## Alunos
- Wagner Luz Barbosa Junior

## Como rodar

```bash
node src/main.js
```

## Estrutura

```
src/
  Conexao.js              ← Singleton
  PedidoBuilder.js        ← Builder
  pagamentos/
    PagamentoFactory.js   ← Factory Method
    CartaoCredito.js
    Pix.js
    Boleto.js
  main.js                 ← Demonstração
```

---

## Padrões aplicados

### Tarefa 01 — Singleton (`Conexao.js`)

**Por que faz sentido usar Singleton aqui? Quais problemas ele resolve?**

Abrir uma conexão com banco é uma operação cara em tempo e memória. Sem Singleton, cada classe que precisasse do banco criaria sua própria conexão — isso desperdiça recursos e pode causar conflitos. O Singleton garante que exista uma única conexão compartilhada por todo o sistema durante a execução.

---

### Tarefa 02 — Factory Method (`pagamentos/`)

**O que acontece quando precisarmos adicionar uma nova forma de pagamento (ex: criptomoeda)?**

A solução facilita bastante. Basta fazer duas coisas:
1. Criar o arquivo `Criptomoeda.js` com o método `processar()`
2. Adicionar `case "cripto": return new Criptomoeda()` na factory

Nenhuma outra parte do sistema muda. O código que usa `PagamentoFactory.criar(tipo)` continua igual — ele nunca conheceu as classes concretas, só a factory. Isso é exatamente o objetivo do padrão.

---

### Tarefa 03 — Builder (`PedidoBuilder.js`)

**Por que Builder é mais adequado do que um construtor com muitos parâmetros?**

Um construtor como `new Pedido(itens, endereco, pagamento, cupom, frete, observacao)` tem vários problemas: é difícil de ler, fácil de passar argumentos na ordem errada, e obriga a passar `null` em campos opcionais.

O Builder resolve isso com uma interface fluente e legível:

```js
new PedidoBuilder()
  .adicionarItem("Camiseta")
  .setEndereco("Rua X")
  .setPagamento("PIX")
  .build()
```

Além disso, o `build()` centraliza todas as validações antes de criar o objeto, garantindo que nenhum pedido inválido seja criado.
