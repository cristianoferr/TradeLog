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
    public class BalancoController : BaseController<Balanco, BPBalanco>
    {

        // GET: odata/Balanco(5)
        [EnableQuery,ODataRoute("Balanco")]
        public IQueryable<Balanco> GetBalancos()
        {
            var saida = db.Balancos.Where(balanco => balanco.Carteira.IdUsuario == idUsuarioAtual).Include(p => p.Carteira).Include(p => p.Carteira.Posicao).Include(p => p.Carteira.Posicao.Select(x => x.Papel)).Include(p => p.Papel).OrderBy(p => p.Papel.Codigo); ;
            return saida;
        }

        [HttpPost]
        public IHttpActionResult RemoveBalanco(ODataActionParameters parameters)
        {
            string saida = "Removendo balanco:" + parameters["IdPapel"] + " ";
            string err = "";
            bool resultado = bp.RemoveBalanco(out err, idUsuarioAtual, (int)parameters["IdCarteira"], (int)parameters["IdPapel"]);
            return resultado ? (IHttpActionResult)Ok(saida) : (IHttpActionResult)BadRequest(err);

        }

        [HttpPost]
        public IHttpActionResult AdicionaBalanco(ODataActionParameters parameters)
        {
            string saida = "AdicionaBalanco balanco:" + parameters["IdPapel"] + " ";
            string err = "";
            bool resultado = bp.AdicionaBalanco(out err, idUsuarioAtual, (int)parameters["IdCarteira"], (int)parameters["IdPapel"]);
            return resultado ? (IHttpActionResult)Ok(saida) : (IHttpActionResult)BadRequest(err);

        }

        

        // PATCH: odata/Balanco(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Balanco> patch)
        {

            if (idUsuarioAtual == -1)
            {
                return BadRequest("invalid_user");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Balanco Balanco = await db.Balancos.FindAsync(key);
            if (Balanco == null)
            {
                return NotFound();
            }
            Carteira cart = await db.Carteiras.FindAsync(Balanco.IdCarteira);

            if (cart.IdUsuario != idUsuarioAtual)
            {
                return BadRequest("NO PERMISSION!");
            }

            patch.Patch(Balanco);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BalancoExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(Balanco);

        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BalancoExists(int IdBalanco)
        {
            return db.Balancos.Count(e => e.IdBalanco == IdBalanco) > 0;
        }
    }
}
