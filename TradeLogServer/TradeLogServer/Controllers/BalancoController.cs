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
        [EnableQuery]
        public IQueryable<Balanco> GetBalanco([FromODataUri] int key)
        {
            var saida = db.Balancos.Where(balanco => balanco.IdCarteira == key && balanco.Carteira.IdUsuario == idUsuarioAtual).Include(p => p.Carteira).Include(p => p.Carteira.Posicao).Include(p => p.Carteira.Posicao.Select(x => x.Papel)).Include(p => p.Papel).OrderBy(p => p.Papel.Codigo); ;
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
        [HttpPatch]
        public async Task<IHttpActionResult> Patch([FromODataUri] int IdCarteira, [FromODataUri] int IdPapel, Delta<Balanco> patch)
        {

            if (idUsuarioAtual == -1)
            {
                return BadRequest("invalid_user");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Balanco Balanco = await db.Balancos.FindAsync(IdCarteira, IdPapel);
            if (Balanco == null)
            {
                return NotFound();
            }
            if (Balanco.Carteira.IdUsuario != idUsuarioAtual)
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
                if (!BalancoExists(IdCarteira, IdPapel))
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

        private bool BalancoExists(int IdCarteira, int IdPapel)
        {
            return db.Balancos.Count(e => e.IdCarteira == IdCarteira && e.IdPapel==IdPapel) > 0;
        }
    }
}
