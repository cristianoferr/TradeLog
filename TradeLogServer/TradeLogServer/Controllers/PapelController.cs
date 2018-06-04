using Newtonsoft.Json.Linq;
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
using TradeLogServer.WebData;

namespace TradeLogServer.Controllers
{
    public class PapelController : BaseController<Papel,BPPapel>
    {

       /* //exemplo de chamada: http://localhost:58761/odata/Papel/TradeLogServer.Controllers.Update
        [HttpPost]
        [AllowAnonymous]
        public IHttpActionResult Update()
        {
            return Ok(bp.UpdateHistoricoDoPapel());
        }*/

        // GET: odata/Carteira(5)/Posicao
        [HttpGet]
       // [ODataRoute("Papel({key})/UpdateValores")]
        public IHttpActionResult UpdateValores([FromODataUri] int key)
        {
            if (key != 1443) return BadRequest("Wrong Key!");
            return Ok(bp.UpdateHistoricoDoPapel());
        }

        // GET: odata/Papel
        [EnableQuery]
        public IQueryable<Papel> GetPapel()
        {
            return db.Papeis;
        }

        // GET: odata/Papel(5)
        [EnableQuery]
        public SingleResult<Papel> GetPapel([FromODataUri] int key)
        {
            return SingleResult.Create(db.Papeis.Where(papel => papel.IdPapel == key).OrderBy(x=>x.Codigo));
        }

        [HttpPost]
        public IHttpActionResult CadastraPapel(ODataActionParameters parameters)
        {
            int LotePadrao = (int)parameters["LotePadrao"];
            string Codigo = (string)parameters["Codigo"];
            string Nome = (string)parameters["Nome"];


            string err = "";
            bool resultado = bp.CadastraPapel(out err, idUsuarioAtual, Codigo,Nome,LotePadrao);

            if (resultado)
            {
                return Ok("PAPEL OK");
            }
            else
            {
                return BadRequest(err);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PapelExists(int key)
        {
            return db.Papeis.Count(e => e.IdPapel == key) > 0;
        }
    }
}
