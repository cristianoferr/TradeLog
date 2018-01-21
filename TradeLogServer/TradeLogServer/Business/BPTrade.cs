using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPTrade : BaseBP<Trade>
    {

        internal bool ExecutaTrade(out string err, int idCarteira,int idUsuarioAtual, string direcao,int idPapel, float precoAcao, int quantidade, float custoOperacao, float precoStopOpcional)
        {
            err = "";
            Carteira carteira = GetValidCarteira(idCarteira, idUsuarioAtual);

            if (carteira == null)
            {
                err = "Invalid Wallet";
                return false;
            }

            if (precoAcao <= 0)
            {
                err = "Invalid Price";
                return false;
            }

            float valorTotal = quantidade * precoAcao;
            BPPosicao bpPosicao = new BPPosicao();bpPosicao.db = db;
            Posicao posicao = bpPosicao.GetOrCreatePosicaoForPapel(carteira, idPapel);

            if (posicao == null)
            {
                err = "Invalid Posicao";
                return false;
            }

            Trade trade = new Trade();
            trade.Posicao = posicao;
            if (direcao =="C") trade.QuantidadeComprada = quantidade;
            if (direcao == "V") trade.QuantidadeVendida= quantidade;
            trade.PrecoTrade = precoAcao;
            trade.Data = DateTime.Now;

            db.Trades.Add(trade);
            posicao.Trade.Add(trade);

            bpPosicao.AtualizaDadosDosTrades(posicao);


            SalvaDados();


            return true;
        }

        
    }
}