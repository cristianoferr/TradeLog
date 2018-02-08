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
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using System.Web.OData.Routing;
using TradeLogServer.Business;
using TradeLogServer.Models;

namespace TradeLogServer.Controllers
{
    public class EvolucaoController : BaseController<Evolucao, BPEvolucao>
    {
        // GET: odata/Evolucao
        [EnableQuery]
        public IQueryable<Evolucao> GetEvolucao()
        {
            return db.Evolucaos;
        }

        // GET: odata/Evolucao(5)
        [EnableQuery]
        public SingleResult<Evolucao> GetEvolucao([FromODataUri] int key)
        {
            return SingleResult.Create(db.Evolucaos.Where(evolucao => evolucao.IdEvolucao == key));
        }


        [HttpGet]
        public IHttpActionResult UpdateEvolucao([FromODataUri] int key)
        {
            if (key != 1443) return BadRequest("Wrong Key!");
            return Ok(bp.UpdateEvolucao());
        }

        // GET: odata/Evolucao(5)/Carteira
        [EnableQuery]
        public SingleResult<Carteira> GetCarteira([FromODataUri] int key)
        {
            return SingleResult.Create(db.Evolucaos.Where(m => m.IdEvolucao == key).Select(m => m.Carteira));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EvolucaoExists(int key)
        {
            return db.Evolucaos.Count(e => e.IdEvolucao == key) > 0;
        }
    }
}
