using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.ModelBinding;
using System.Web.OData;
using System.Web.OData.Extensions;
using System.Web.OData.Routing;
using TradeLogServer.Business;
using TradeLogServer.Models;

namespace TradeLogServer.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using TradeLogServer.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Posicao>("Posicao");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class PosicaoController : BaseController<Posicao,BPPosicao>
    {

        /*Retorna os trades que fazem parte da posicao informada pela key*/
        // GET: odata/Posicao(5)/Trade
        [EnableQuery]
        [HttpGet]
       // [ODataRoute("Posicao({key})/Trade")]
        public IQueryable<Trade> Trade([FromODataUri] int key)
        {
            return db.Trades.Where(trade => trade.IdPosicao== key && trade.Posicao.IdUsuario == idUsuarioAtual).Include(t => t.Posicao);
        }


        // GET: odata/Posicao
        [EnableQuery]
        public SingleResult<Posicao> GetPosicao([FromODataUri] int key)
        {
            return SingleResult.Create(bp.GetQueryPosicao(key,idUsuarioAtual));
        }

        // GET: odata/Posicao(5)
        [EnableQuery]
        public IQueryable<Posicao> GetPosicao()
        {
            return db.Posicoes.Where(posicao => posicao.IdUsuario == idUsuarioAtual &&  posicao.FlagAtivo == "T").Include(p => p.Papel);
        }


        // PATCH: odata/Posicao(5)
        [AcceptVerbs("PATCH", "MERGE")]
        [HttpPatch]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Posicao> patch)
        {

            if (idUsuarioAtual == -1)
            {
                return BadRequest("invalid_user");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Posicao posicao = await db.Posicoes.FindAsync(key);
            if (posicao == null)
            {
                return NotFound();
            }
            if (posicao.IdUsuario != idUsuarioAtual)
            {
                return BadRequest("NO PERMISSION!");
            }

            patch.Patch(posicao);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PosicaoExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(posicao);

        }

        /* [HttpPost]
         public IHttpActionResult FechaPosicao(ODataActionParameters parameters)
         {
             //  string err = "";
             // bool resultado = bp.FechaPosicao(out err, idUsuarioAtual, (int)parameters["IdPosicao"], (float)parameters["valorAcao"], (int)(Single)parameters["quantidadeFechada"]);

             //  return resultado ? (IHttpActionResult)Ok() : (IHttpActionResult)BadRequest(err);
             return Ok("nyi");
         }
         */

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PosicaoExists(int key)
        {
            return db.Posicoes.Count(e => e.IdPosicao == key) > 0;
        }
    }
}
