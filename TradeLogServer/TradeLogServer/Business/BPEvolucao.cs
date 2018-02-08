using Microsoft.OData.Edm;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPEvolucao : BaseBP<Evolucao>
    {
        internal string UpdateEvolucao()
        {
            IList<Carteira> carteiras = db.Carteiras.Include(x => x.Posicao).Include(p => p.Posicao.Select(x => x.Papel)).ToList();

            string saida = "Atualizando as carteiras:\n ";
            foreach(Carteira carteira in carteiras)
            {
                SalvaEvolucao(carteira);
            }

            SalvaDados();
            return saida;
        }

        private void SalvaEvolucao(Carteira carteira)
        {
            Evolucao evo = new Evolucao();
            evo.Carteira = carteira;
            evo.Data = Date.Now;
            evo.ValorLiquido = carteira.ValorLiquido;
            evo.ValorPosicao = carteira.ValorAtual - carteira.ValorLiquido;
            db.Evolucaos.Add(evo);
        }
    }
}