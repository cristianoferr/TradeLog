using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPPosicao : BaseBP<Posicao>
    {
        internal bool FechaPosicao(out string err, int idUsuarioAtual, int idPosicao, float valorFechamento)
        {
            err = "";
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
            posicao.Carteira = null;
            posicao.IdCarteira = null;
            MovimentaSaldoParaCarteira(posicao.CalcValor(valorFechamento)-carteira.CustoOperacaoPadrao,"Closing Position on "+posicao.CodigoPapel, carteira);

            SalvaDados();
            return true;
        }
    }
}