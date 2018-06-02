using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPBalanco : BaseBP<Balanco>
    {
        internal bool RemoveBalanco(out string err, int idUsuarioAtual, int IdCarteira, int IdPapel)
        {
            err = "OK";
            if (db.Balancos.Where(x => x.IdCarteira == IdCarteira && x.IdPapel == IdPapel && x.Carteira.IdUsuario == idUsuarioAtual).FirstOrDefault() != null)
            {
                db.Balancos.Remove(db.Balancos.Single(x => x.IdCarteira == IdCarteira && x.IdPapel == IdPapel && x.Carteira.IdUsuario==idUsuarioAtual));
                SalvaDados();
                return true;
            }
            return false;
        }

        internal bool AdicionaBalanco(out string err, int idUsuarioAtual, int IdCarteira, int IdPapel)
        {
            err = "OK";
            if (db.Balancos.Where(x => x.IdCarteira == IdCarteira && x.IdPapel == IdPapel && x.Carteira.IdUsuario == idUsuarioAtual).FirstOrDefault()==null)
            {
                Balanco b = new Balanco();
                b.PesoPapel = 1;
                b.FlagCongelado = "F";
                b.IdCarteira = IdCarteira;
                b.IdPapel = IdPapel;
                db.Balancos.Add(b);
                SalvaDados();
                return true;
            }
            return false;
        }
    }
}