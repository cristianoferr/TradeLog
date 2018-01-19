using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BaseBP<TModel> where TModel:BaseModel
    {
        public ApplicationDbContext db { get; set; }

        public BaseBP()
        {
        }

        internal void SalvaDados()
        {
            try
            {
                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        internal IQueryable<Posicao> GetQueryPosicao(int key, int idUsuarioAtual)
        {
            return db.Posicoes.Where(posicao => posicao.IdPosicao == key && posicao.IdUsuario == idUsuarioAtual).Include(p => p.Papel).Include(p => p.Carteira);
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

            AdicionaMovimento(valor, mensagem, carteira, null);
            return valor;
        }

        internal Carteira GetValidCarteira(int idCarteira, int idUsuarioAtual)
        {
            Carteira carteira = db.Carteiras.Find(idCarteira);
            if (carteira != null && carteira.IdUsuario != idUsuarioAtual) carteira = null;
            return carteira;
        }

        internal Posicao GetValidPosicao(int idPosicao, int idUsuarioAtual)
        {
            return GetQueryPosicao(idPosicao, idUsuarioAtual).FirstOrDefault();
        }

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