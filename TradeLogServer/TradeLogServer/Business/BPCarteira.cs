using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPCarteira : BaseBP<Carteira>
    {

        internal bool MovimentaFundo(out string err, int idUsuarioAtual,int idCarteira, float valor, string mensagem)
        {
            err = "";
            Carteira carteira = GetValidCarteira(idCarteira, idUsuarioAtual);
            if (carteira == null)
            {
                err = "Carteira: NotFound ";
                return false;
            }
            if (valor == 0)
            {
                err = "No Fund to transfer";
                return false;
            }

            valor = MovimentaSaldoParaCarteira(valor, mensagem, carteira);

            SalvaDados();

            return true;
        }

        



    }
}