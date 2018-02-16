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

        internal bool ExecutaTrade(out string err, int idCarteira,int idUsuarioAtual, string direcao,int idPapel, float precoAcao, int quantidade, float custoOperacao, float precoStopOpcional,bool IsClosing)
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
            Posicao posicao = bpPosicao.GetOrCreatePosicaoForPapel(carteira, idPapel, precoStopOpcional);
            posicao.CustoOperacao += custoOperacao;

            MovimentaFundo(carteira, posicao, valorTotal, quantidade, precoAcao, direcao,custoOperacao);

            if (posicao == null)
            {
                err = "Invalid Posicao";
                return false;
            }

            Trade trade = new Trade();
            trade.Posicao = posicao;
            trade.CustoOperacao += custoOperacao;
            if (precoStopOpcional > 0)
            {
                posicao.PrecoStopAtual = precoStopOpcional;
            }
            
            if (direcao =="C") trade.QuantidadeComprada = quantidade;
            if (direcao == "V") trade.QuantidadeVendida= quantidade;
            trade.PrecoTrade = precoAcao;
            trade.Data = DateTime.Now;

            db.Trades.Add(trade);
            posicao.Trade.Add(trade);

            bpPosicao.AtualizaDadosDosTrades(posicao);

            if (IsClosing)
            {
                posicao.FlagAtivo = "F";
            }

            SalvaDados();


            return true;
        }

        private void MovimentaFundo(Carteira carteira, Posicao posicao, float valorTotal, int quantidade, float precoAcao, string direcao, float custoOperacao)
        {
            BPCarteira bpC = new BPCarteira();
            bpC.db = db;
            string err = "";
            Papel papel = posicao.Papel;
            int multi = direcao == "C" ? multi = -1 : multi = 1;
            bpC.MovimentaFundo(out err, carteira.IdUsuario, carteira.IdCarteira, valorTotal*multi- custoOperacao, "Buying "+quantidade +" "+papel.Codigo+" for "+precoAcao+", total of "+ valorTotal+" minus "+ custoOperacao+" for costs.",posicao);
        }
    }
}