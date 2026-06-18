// Tarefas 04 a 09 — Padrões Estruturais e Comportamentais

// Adapter
class GatewayLegado {
  cobrar(codigoPedido, valorEmCentavos) {
    console.log(`Gateway legado processando pedido ${codigoPedido} no valor de ${valorEmCentavos} centavos.`);
  }
}

class GatewayAdapter {
  constructor(gateway = new GatewayLegado(), codigoPedido = "PEDIDO-LEGADO") {
    this.gateway = gateway;
    this.codigoPedido = codigoPedido;
  }

  processar(valor) {
    const valorEmCentavos = Math.round(valor * 100);
    this.gateway.cobrar(this.codigoPedido, valorEmCentavos);
  }
}

// Decorator
class PagamentoDecorator {
  constructor(pagamento) {
    this.pagamento = pagamento;
  }

  processar(valor) {
    return this.pagamento.processar(valor);
  }
}

class LogDecorator extends PagamentoDecorator {
  processar(valor) {
    console.log(`LogDecorator: cobrando R$${valor.toFixed(2)}.`);
    return super.processar(valor);
  }
}

class DescontoDecorator extends PagamentoDecorator {
  constructor(pagamento, percentual) {
    super(pagamento);
    this.percentual = percentual;
  }

  processar(valor) {
    const valorComDesconto = Number((valor * (1 - this.percentual / 100)).toFixed(2));
    console.log(`DescontoDecorator: desconto de ${this.percentual}% aplicado.`);
    return super.processar(valorComDesconto);
  }
}

// Objeto base para Facade, Observer e Command
class Pedido {
  constructor({ itens = [], endereco = "", pagamento = null, valorTotal = 0, status = "novo" } = {}) {
    this.itens = itens;
    this.endereco = endereco;
    this.pagamento = pagamento;
    this.valorTotal = valorTotal;
    this.status = status;
    this.observers = [];
  }

  adicionarObserver(observer) {
    this.observers.push(observer);
    return this;
  }

  alterarStatus(status) {
    this.status = status;
    this.notificar();
    return this;
  }

  confirmar() {
    return this.alterarStatus("confirmado");
  }

  cancelar() {
    return this.alterarStatus("cancelado");
  }

  atualizarEndereco(endereco) {
    this.endereco = endereco;
    return this;
  }

  notificar() {
    this.observers.forEach((observer) => observer.atualizar(this));
  }

  toString() {
    return `Pedido{ status: "${this.status}", endereco: "${this.endereco}", valorTotal: R$${this.valorTotal.toFixed(2)} }`;
  }
}

// Facade
class EstoqueService {
  verificar(pedido) {
    console.log(`EstoqueService: verificando ${pedido.itens.length} item(ns).`);
    return true;
  }
}

class PagamentoService {
  processar(pedido) {
    if (pedido.pagamento && typeof pedido.pagamento.processar === "function") {
      pedido.pagamento.processar(pedido.valorTotal);
      return true;
    }

    console.log("PagamentoService: pagamento não disponível.");
    return false;
  }
}

class CarrinhoService {
  atualizar(pedido) {
    console.log(`CarrinhoService: carrinho do pedido com ${pedido.itens.length} item(ns) atualizado.`);
  }
}

class EmailService {
  enviarConfirmacao(pedido) {
    console.log(`EmailService: confirmação enviada para ${pedido.endereco}.`);
  }
}

class CheckoutFacade {
  constructor(
    estoqueService = new EstoqueService(),
    pagamentoService = new PagamentoService(),
    carrinhoService = new CarrinhoService(),
    emailService = new EmailService()
  ) {
    this.estoqueService = estoqueService;
    this.pagamentoService = pagamentoService;
    this.carrinhoService = carrinhoService;
    this.emailService = emailService;
  }

  finalizar(pedido) {
    this.estoqueService.verificar(pedido);
    this.pagamentoService.processar(pedido);
    this.carrinhoService.atualizar(pedido);
    this.emailService.enviarConfirmacao(pedido);
    pedido.confirmar();
    console.log("CheckoutFacade: pedido finalizado.");
  }
}

// Strategy
class EstrategiaFrete {
  calcular() {
    throw new Error("Estratégia de frete deve implementar calcular(peso).");
  }
}

class FreteCorreios extends EstrategiaFrete {
  calcular(peso) {
    return Number((12 + peso * 2.5).toFixed(2));
  }
}

class FreteJadlog extends EstrategiaFrete {
  calcular(peso) {
    return Number((9 + peso * 2).toFixed(2));
  }
}

class FreteRetirada extends EstrategiaFrete {
  calcular() {
    return 0;
  }
}

class Carrinho {
  constructor(estrategiaFrete = new FreteCorreios()) {
    this.estrategiaFrete = estrategiaFrete;
    this.itens = [];
  }

  adicionarItem(nome, peso, valor) {
    this.itens.push({ nome, peso, valor });
    return this;
  }

  setFrete(estrategiaFrete) {
    this.estrategiaFrete = estrategiaFrete;
    return this;
  }

  getPesoTotal() {
    return this.itens.reduce((total, item) => total + item.peso, 0);
  }

  getSubtotal() {
    return this.itens.reduce((total, item) => total + item.valor, 0);
  }

  calcularFrete() {
    return this.estrategiaFrete.calcular(this.getPesoTotal());
  }

  calcularTotal() {
    return Number((this.getSubtotal() + this.calcularFrete()).toFixed(2));
  }
}

// Observer
class EmailObserver {
  atualizar(pedido) {
    console.log(`EmailObserver: cliente notificado sobre o pedido ${pedido.status}.`);
  }
}

class EstoqueObserver {
  atualizar(pedido) {
    console.log(`EstoqueObserver: baixa de estoque para o pedido ${pedido.status}.`);
  }
}

class LogObserver {
  atualizar(pedido) {
    console.log(`LogObserver: auditoria registrada para o pedido ${pedido.status}.`);
  }
}

// Command
class Comando {
  executar() {
    throw new Error("Comando deve implementar executar().");
  }

  desfazer() {
    throw new Error("Comando deve implementar desfazer().");
  }
}

class CancelarPedidoComando extends Comando {
  constructor(pedido) {
    super();
    this.pedido = pedido;
    this.statusAnterior = pedido.status;
  }

  executar() {
    this.statusAnterior = this.pedido.status;
    this.pedido.cancelar();
    console.log("CancelarPedidoComando: pedido cancelado.");
  }

  desfazer() {
    this.pedido.alterarStatus(this.statusAnterior);
    console.log("CancelarPedidoComando: cancelamento desfeito.");
  }
}

class AtualizarEnderecoComando extends Comando {
  constructor(pedido, novoEndereco) {
    super();
    this.pedido = pedido;
    this.novoEndereco = novoEndereco;
    this.enderecoAnterior = pedido.endereco;
  }

  executar() {
    this.enderecoAnterior = this.pedido.endereco;
    this.pedido.atualizarEndereco(this.novoEndereco);
    console.log(`AtualizarEnderecoComando: endereço alterado para ${this.novoEndereco}.`);
  }

  desfazer() {
    this.pedido.atualizarEndereco(this.enderecoAnterior);
    console.log("AtualizarEnderecoComando: endereço restaurado.");
  }
}

class GerenciadorComandos {
  constructor() {
    this.historico = [];
  }

  executar(comando) {
    comando.executar();
    this.historico.push(comando);
  }

  desfazer() {
    const comando = this.historico.pop();
    if (!comando) {
      console.log("GerenciadorComandos: nada para desfazer.");
      return;
    }

    comando.desfazer();
  }
}

module.exports = {
  GatewayLegado,
  GatewayAdapter,
  PagamentoDecorator,
  LogDecorator,
  DescontoDecorator,
  Pedido,
  EstoqueService,
  PagamentoService,
  CarrinhoService,
  EmailService,
  CheckoutFacade,
  EstrategiaFrete,
  FreteCorreios,
  FreteJadlog,
  FreteRetirada,
  Carrinho,
  EmailObserver,
  EstoqueObserver,
  LogObserver,
  Comando,
  CancelarPedidoComando,
  AtualizarEnderecoComando,
  GerenciadorComandos,
};