using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPMovimento:BaseBP<Movimento>
    {

        internal void AdicionaMovimento(float valor, string mensagem, Carteira carteira, Posicao posicao)
        {
            Movimento movimento = new Movimento();
            movimento.Carteira = carteira;
            movimento.IdCarteira = carteira.IdCarteira;
            movimento.ValorMovimento = valor;
            movimento.Posicao = posicao;
            int? idPosicao = null;
            if (posicao != null) idPosicao = posicao.IdPosicao;
            movimento.IdPosicao = idPosicao;
            movimento.DataMovimento = DateTime.Now;
            movimento.Descricao = (valor > 0) ? valor + " added to wallet." : Math.Abs(valor) + " removed from wallet.";
            movimento.Descricao += "(" + mensagem + ")";
            db.Movimentoes.Add(movimento);
        }
    }
}