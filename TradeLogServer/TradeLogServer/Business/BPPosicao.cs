using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPPosicao : BaseBP<Posicao>
    {
        internal void AtualizaDadosDosTrades(Posicao posicao)
        {
            posicao.PrecoMedioCompra = CalculaValorMedio(posicao,Utils.Utils.DIRECAO_COMPRA);
            posicao.PrecoMedioVenda = CalculaValorMedio(posicao, Utils.Utils.DIRECAO_VENDA);
            posicao.QuantidadeComprada= posicao.Trade.Where(x => x.QuantidadeComprada > 0).Sum(x => x.QuantidadeComprada);
            posicao.QuantidadeVendida= posicao.Trade.Where(x => x.QuantidadeVendida > 0).Sum(x => x.QuantidadeVendida);
        }

        private float CalculaValorMedio(Posicao posicao,int direcao)
        {
            float vlrTotal = 0;

            //retorna uma lista com todos os trades na direcao indicada...
            var tradesNaDirecao = posicao.Trade.Where(x => (x.QuantidadeVendida > 0 && direcao == Utils.Utils.DIRECAO_VENDA) || (x.QuantidadeComprada > 0 && direcao == Utils.Utils.DIRECAO_COMPRA));

            //Somatorio do total
            vlrTotal = tradesNaDirecao.Sum(x => x.ValorTrade);


            float vlrMedio = 0;
            foreach (Trade trade in tradesNaDirecao)
            {
                float percTrade = trade.ValorTrade / vlrTotal;
                float vlrRelativoTrade = percTrade * trade.PrecoTrade;
                vlrMedio += vlrRelativoTrade;
            }

            return vlrMedio;
        }


        /* internal bool FechaPosicao(out string err, int idUsuarioAtual, int idPosicao, float valorFechamento,int quantidadeFechada)
{
    err = "";
    quantidadeFechada = Math.Abs(quantidadeFechada);
    if (quantidadeFechada == 0)
    {
        err = "Posicao: 0 quantity";
        return false;
    }
    Posicao posicao = GetValidPosicao(idPosicao, idUsuarioAtual);

    if (posicao == null)
    {
        err = "Posicao: NotFound ";
        return false;
    }
    if (posicao.IdCarteira == null || posicao.IdCarteira==0)
    {
        err = "Posicao: Already Closed ";
        return false;
    }

    int idCarteira = posicao.IdCarteira ?? default(int);
    Carteira carteira = GetValidCarteira(idCarteira, idUsuarioAtual);
    posicao.Quantidade -= quantidadeFechada;
    if (posicao.Quantidade < 0)
    {
        quantidadeFechada += posicao.Quantidade;
        posicao.Quantidade = 0;
    }

    if (posicao.Quantidade == 0)
    {
        posicao.Carteira = null;
        posicao.IdCarteira = null;
        posicao.DataSaida = DateTime.Now;
    }

    float valor = valorFechamento * quantidadeFechada;
    string saida = String.Format("Selling {0}x{1} of {2} for $ {3}, you have {4} stocks left.",valorFechamento,quantidadeFechada,posicao.CodigoPapel, valor,posicao.Quantidade);
    MovimentaSaldoParaCarteira(valor-carteira.CustoOperacaoPadrao, saida, carteira);

    SalvaDados();
    return true;
}*/


        internal Posicao GetOrCreatePosicaoForPapel(Carteira carteira, int idPapel)
        {
            Papel papel = db.Papels.Where(x => x.IdPapel == idPapel).FirstOrDefault();
            if (papel == null) return null;

            Posicao posicao = db.Posicoes.Where(x => x.IdCarteira == carteira.IdCarteira && x.IdPapel == papel.IdPapel).Include(p => p.Papel).Include(p => p.Trade).FirstOrDefault();

            if (posicao == null)
            {
                posicao = new Posicao();
                posicao.Carteira = carteira;
                posicao.Papel = papel;
                posicao.IdPapel = papel.IdPapel;
                posicao.DataEntrada = DateTime.Now;
                posicao.QuantidadeComprada = 0;
                posicao.QuantidadeVendida = 0;
                posicao.PrecoMedioCompra = 0;
                posicao.PrecoMedioVenda = 0;
                posicao.IdUsuario = carteira.IdUsuario;
                posicao.Usuario = carteira.Usuario;
                db.Posicoes.Add(posicao);
            }


            return posicao;

        }
    }
}