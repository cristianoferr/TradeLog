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
            return db.Posicoes.Where(posicao => posicao.IdPosicao == key && posicao.IdUsuario == idUsuarioAtual && posicao.FlagAtivo=="T").Include(p => p.Trade).Include(p => p.Papel).Include(p => p.Carteira);
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

       

    }
}