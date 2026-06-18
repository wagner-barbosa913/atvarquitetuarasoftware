// — Singleton
class Conexao {
  constructor() {
    this.url = "mysql://localhost:3306/ecommerce";
    console.log("Conexão criada com: " + this.url);
    Conexao._instancia = this;
  }

  static getInstance() {
    if (!Conexao._instancia) {
      new Conexao();
    }
    return Conexao._instancia;
  }

  executarQuery(sql) {
    console.log("Executando: " + sql);
  }
}

module.exports = Conexao;
