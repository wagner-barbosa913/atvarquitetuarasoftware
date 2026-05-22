// Tarefa 02 — Factory Method
const CartaoCredito = require("./CartaoCredito");
const Pix = require("./Pix");
const Boleto = require("./Boleto");

class PagamentoFactory {
  static criar(tipo) {
    switch (tipo.toLowerCase()) {
      case "cartao": return new CartaoCredito();
      case "pix":    return new Pix();
      case "boleto": return new Boleto();
      default: throw new Error("Tipo de pagamento desconhecido: " + tipo);
    }
  }
}

module.exports = PagamentoFactory;
