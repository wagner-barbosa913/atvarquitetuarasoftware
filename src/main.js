const Conexao        = require("./Conexao");
const PagamentoFactory = require("./pagamentos/PagamentoFactory");
const PedidoBuilder  = require("./PedidoBuilder");

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
