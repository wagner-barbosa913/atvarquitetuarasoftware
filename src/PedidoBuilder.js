// Tarefa 03 — Builder
class Pedido {
  constructor(itens, endereco, pagamento) {
    this.itens = itens;
    this.endereco = endereco;
    this.pagamento = pagamento;
  }

  toString() {
    return `Pedido{ itens: [${this.itens}], endereco: "${this.endereco}", pagamento: "${this.pagamento}" }`;
  }
}

class PedidoBuilder {
  constructor() {
    this.itens = [];
    this.endereco = null;
    this.pagamento = null;
  }

  adicionarItem(item) {
    this.itens.push(item);
    return this;
  }

  setEndereco(endereco) {
    this.endereco = endereco;
    return this;
  }

  setPagamento(pagamento) {
    this.pagamento = pagamento;
    return this;
  }

  build() {
    if (this.itens.length === 0) throw new Error("O pedido precisa ter pelo menos um item.");
    if (!this.endereco)          throw new Error("O pedido precisa ter um endereço.");
    if (!this.pagamento)         throw new Error("O pedido precisa ter uma forma de pagamento.");
    return new Pedido(this.itens, this.endereco, this.pagamento);
  }
}

module.exports = PedidoBuilder;
