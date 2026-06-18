const Conexao        = require("./Conexao");
const PagamentoFactory = require("./pagamentos/PagamentoFactory");
const PedidoBuilder  = require("./PedidoBuilder");
const {
  GatewayAdapter,
  LogDecorator,
  DescontoDecorator,
  Pedido,
  CheckoutFacade,
  Carrinho,
  FreteCorreios,
  FreteJadlog,
  FreteRetirada,
  EmailObserver,
  EstoqueObserver,
  LogObserver,
  CancelarPedidoComando,
  AtualizarEnderecoComando,
  GerenciadorComandos,
} = require("./patternsAdicionais");

// Singleton
console.log("=== Singleton ===");
const c1 = Conexao.getInstance();
const c2 = Conexao.getInstance();
c1.executarQuery("SELECT * FROM produtos");
console.log("Mesma instância?", c1 === c2);

// Factory Method
console.log("\n=== Factory Method ===");
PagamentoFactory.criar("pix").processar(150.00);
PagamentoFactory.criar("cartao").processar(299.90);
PagamentoFactory.criar("boleto").processar(89.50);

// Builder
console.log("\n=== Builder ===");
const pedido = new PedidoBuilder()
  .adicionarItem("Camiseta")
  .adicionarItem("Tênis")
  .setEndereco("Rua agulhas negras, 102")
  .setPagamento("PIX")
  .build();
console.log(pedido.toString());

// Validação Builder
console.log("\n=== Validação Builder ===");
try {
  new PedidoBuilder().setEndereco("Rua X").setPagamento("Boleto").build();
} catch (e) {
  console.log("Erro esperado:", e.message);
}

// Adapter
console.log("\n=== Adapter ===");
new GatewayAdapter().processar(123.45);

// Decorator
console.log("\n=== Decorator ===");
new LogDecorator(new DescontoDecorator(PagamentoFactory.criar("pix"), 10)).processar(200.00);

// Facade
console.log("\n=== Facade ===");
const pedidoCheckout = new Pedido({
  itens: ["Mouse", "Teclado"],
  endereco: "Rua Agulhas Negras, 102",
  pagamento: PagamentoFactory.criar("cartao"),
  valorTotal: 350.00,
});
new CheckoutFacade().finalizar(pedidoCheckout);

// Strategy
console.log("\n=== Strategy ===");
const carrinho = new Carrinho(new FreteCorreios())
  .adicionarItem("Livro", 1.2, 80)
  .adicionarItem("Fone", 0.4, 120);
console.log("Frete Correios:", carrinho.calcularFrete());
carrinho.setFrete(new FreteJadlog());
console.log("Frete Jadlog:", carrinho.calcularFrete());
carrinho.setFrete(new FreteRetirada());
console.log("Frete Retirada:", carrinho.calcularFrete());

// Observer
console.log("\n=== Observer ===");
const pedidoObservado = new Pedido({
  itens: ["Notebook"],
  endereco: "Av. Central, 500",
  pagamento: PagamentoFactory.criar("pix"),
  valorTotal: 4200.00,
});
pedidoObservado
  .adicionarObserver(new EmailObserver())
  .adicionarObserver(new EstoqueObserver())
  .adicionarObserver(new LogObserver());
pedidoObservado.confirmar();

// Command
console.log("\n=== Command ===");
const gerenciador = new GerenciadorComandos();
const pedidoComando = new Pedido({
  itens: ["Monitor"],
  endereco: "Rua Inicial, 10",
  pagamento: PagamentoFactory.criar("boleto"),
  valorTotal: 899.90,
  status: "em processamento",
});
gerenciador.executar(new CancelarPedidoComando(pedidoComando));
gerenciador.desfazer();
gerenciador.executar(new AtualizarEnderecoComando(pedidoComando, "Rua Nova, 123"));
gerenciador.desfazer();
