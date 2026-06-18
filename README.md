# E-commerce — Padrões Criacionais, Estruturais e Comportamentais

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
  patternsAdicionais.js   ← Adapter, Decorator, Facade, Strategy, Observer, Command
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

---

### Tarefa 04 — Adapter

Sem o Adapter, o código cliente teria que conhecer a API antiga do gateway e espalhar conversões pelo sistema. O Adapter mantém o contrato atual e encapsula a tradução para o legado.

### Tarefa 05 — Decorator

Os decorators permitem combinar log e desconto sem alterar `Pix`, `Boleto` ou `CartaoCredito`. É mais flexível do que herança simples porque a composição acontece em tempo de execução.

### Tarefa 06 — Facade

A Facade concentra a orquestração de estoque, pagamento, carrinho e e-mail. Sem ela, o controller ficaria acoplado a todos esses subsistemas e quebraria mais facilmente quando uma API mudasse.

### Tarefa 07 — Strategy

O carrinho recebe a estratégia de frete por composição e troca de transportadora em tempo de execução. Para adicionar uma nova transportadora, basta criar outra estratégia.

### Tarefa 08 — Observer

O `Pedido` mantém uma lista de observers e notifica todos quando o status muda. Para incluir SMS, por exemplo, não é preciso alterar a classe `Pedido`.

### Tarefa 09 — Command

Os comandos encapsulam ações e guardam estado anterior para desfazer. Além do undo, isso ajuda a enfileirar, auditar e processar ações de forma assíncrona.

---

## Decisões arquiteturais

### Adapter

Usei `GatewayLegado` com API diferente e `GatewayAdapter` para expor o contrato já usado pelo sistema.

### Decorator

Os decorators envolvem um pagamento real e delegam a chamada, permitindo adicionar responsabilidades sem mexer nas classes existentes.

### Facade

`CheckoutFacade.finalizar(pedido)` reúne o fluxo de finalização em um único ponto.

### Strategy

`Carrinho` troca a política de frete por injeção de estratégia.

### Observer

`Pedido` notifica `EmailObserver`, `EstoqueObserver` e `LogObserver` quando muda de estado.

### Command

`GerenciadorComandos` mantém histórico e permite desfazer cancelamento e alteração de endereço.

---

## Diagrama ASCII

```text
GatewayAdapter -> GatewayLegado
LogDecorator -> DescontoDecorator -> Pagamento real
CheckoutFacade -> EstoqueService + PagamentoService + CarrinhoService + EmailService
Carrinho -> EstrategiaFrete -> FreteCorreios / FreteJadlog / FreteRetirada
Pedido -> EmailObserver / EstoqueObserver / LogObserver
GerenciadorComandos -> CancelarPedidoComando / AtualizarEnderecoComando
```
