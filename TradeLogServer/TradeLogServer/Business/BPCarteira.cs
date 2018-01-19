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
            Carteira carteira = db.Carteiras.Find(idCarteira);
            if (carteira == null || carteira.IdUsuario!=idUsuarioAtual)
            {
                err = "Carteira: NotFound ";
                return false;
            }
            if (valor == 0)
            {
                err = "No Fund to transfer";
                return false;
            }

            carteira.ValorLiquido += valor;
            if (carteira.ValorLiquido < 0)
            {
                valor -= carteira.ValorLiquido;
                carteira.ValorLiquido = 0;
            }

            Movimento movimento = new Movimento();
            movimento.Carteira = carteira;
            movimento.IdCarteira = carteira.IdCarteira;
            movimento.ValorMovimento = valor;
            movimento.Posicao = null;
            movimento.IdPosicao = null;
            movimento.DataMovimento = DateTime.Now;
            movimento.Descricao = (valor > 0) ? valor + " added to wallet.": Math.Abs(valor) + " removed from wallet.";
            movimento.Descricao += "("+mensagem+")";
            db.Movimentoes.Add(movimento);

            SalvaDados();

            return true;
        }

        
    }
}