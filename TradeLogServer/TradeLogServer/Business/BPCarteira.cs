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


        /*
        Função que adiciona um valor à carteira, logando o valor na tabela de movimento
            */
        internal float MovimentaSaldoParaCarteira(float valor, string mensagem, Carteira carteira)
        {
            carteira.ValorLiquido += valor;
            if (carteira.ValorLiquido < 0)
            {
                valor -= carteira.ValorLiquido;
                carteira.ValorLiquido = 0;
            }

            BPMovimento bpMovimento = new BPMovimento();bpMovimento.db = db;

            bpMovimento.AdicionaMovimento(valor, mensagem, carteira, null);
            return valor;
        }


    }
}