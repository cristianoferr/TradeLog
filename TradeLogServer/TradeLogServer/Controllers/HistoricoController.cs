using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.OData;
using System.Web.OData.Routing;
using TradeLogServer.Business;
using TradeLogServer.Models;

namespace TradeLogServer.Controllers
{
    public class HistoricoController : BaseController<Historico,BPHistorico>
    {
        // GET: odata/Historico
        [EnableQuery]
        public IQueryable<Historico> GetHistorico()
        {
            return db.Historicoes;
        }

        // GET: odata/Historico(5)
        [EnableQuery]
        public SingleResult<Historico> GetHistorico([FromODataUri] int key)
        {
            return SingleResult.Create(db.Historicoes.Where(historico => historico.IdHistorico == key));
        }

        // GET: odata/Historico(5)/Papel
        [EnableQuery]
        public SingleResult<Papel> GetPapel([FromODataUri] int key)
        {
            return SingleResult.Create(db.Historicoes.Where(m => m.IdHistorico == key).Select(m => m.Papel));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool HistoricoExists(int key)
        {
            return db.Historicoes.Count(e => e.IdHistorico == key) > 0;
        }
    }
}
