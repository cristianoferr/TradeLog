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
using TradeLogServer.Models;

namespace TradeLogServer.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using TradeLogServer.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Carteira>("Carteira");
    builder.EntitySet<Risco>("Riscoes"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class CarteiraController : BaseController<Carteira>
    {
        // GET: odata/Carteira
        [EnableQuery]
        public IQueryable<Carteira> GetCarteira()
        {
            return db.Carteiras.Where(carteira => carteira.IdUsuario == idUsuarioAtual);
        }

        // GET: odata/Carteira(5)
        [EnableQuery]
        public SingleResult<Carteira> GetCarteira([FromODataUri] int key)
        {
            return SingleResult.Create(db.Carteiras.Where(carteira => carteira.IdCarteira == key && carteira.IdUsuario==idUsuarioAtual).Include(p => p.Posicao));
        }

        // GET: odata/Carteira(5)/Posicao
        [EnableQuery]
        [HttpGet]
        [ODataRoute("Carteira({key})/Posicao")]
        public IQueryable<Posicao> Posicao([FromODataUri] int key)
        {
            return db.Posicoes.Where(posicao => posicao.IdCarteira==key && posicao.IdUsuario==idUsuarioAtual).Include(p => p.Papel);
        }

        // GET: odata/Carteira(5)
        /* [ODataRoute("/Posicoes(key)")]
         public IQueryable<Posicao> GetPosicao([FromODataUri] int key)
         {
             return db.Posicoes.Where(posicao => posicao.IdCarteira== key && posicao.IdUsuario == idUsuarioAtual);
         }*/

        // PUT: odata/Carteira(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Carteira> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Carteira carteira = await db.Carteiras.FindAsync(key);
            if (carteira == null)
            {
                return NotFound();
            }

            patch.Put(carteira);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarteiraExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(carteira);
        }

        // POST: odata/Carteira
        public async Task<IHttpActionResult> Post(Carteira carteira)
        {
            carteira.ValorLiquido = carteira.ValorAtual;
            carteira.IdUsuario = idUsuarioAtual;
            if (!IsUnique(carteira))
            {
                return BadRequest("repeated_name");
            }
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();
                return BadRequest(ModelState);
            }

            db.Carteiras.Add(carteira);
            await db.SaveChangesAsync();

            return Created(carteira);
        }

        private bool IsUnique(Carteira carteira)
        {
            return !db.Carteiras.Where(c => c.NomeCarteira == carteira.NomeCarteira && c.IdUsuario == idUsuarioAtual).Any();
        }

        // PATCH: odata/Carteira(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Carteira> patch)
        {
           // Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Carteira carteira = await db.Carteiras.FindAsync(key);
            if (carteira == null)
            {
                return NotFound();
            }

            patch.Patch(carteira);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarteiraExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(carteira);
        }

        // DELETE: odata/Carteira(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Carteira carteira = await db.Carteiras.FindAsync(key);
            if (carteira == null)
            {
                return NotFound();
            }

            db.Carteiras.Remove(carteira);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Carteira(5)/Usuario
        [EnableQuery]
        public SingleResult<Usuario> GetUsuario([FromODataUri] int key)
        {
            return SingleResult.Create(db.Carteiras.Where(m => m.IdCarteira == key).Select(m => m.Usuario));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CarteiraExists(int key)
        {
            return db.Carteiras.Count(e => e.IdCarteira == key) > 0;
        }
    }
}
