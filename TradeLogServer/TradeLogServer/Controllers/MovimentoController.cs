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
    builder.EntitySet<Movimento>("Movimento");
    builder.EntitySet<Carteira>("Carteiras"); 
    builder.EntitySet<Posicao>("Posicaos"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class MovimentoController : BaseController<Movimento,BPMovimento>
    {
        // GET: odata/Movimento
        [EnableQuery]
        public IQueryable<Movimento> GetMovimento()
        {
            return db.Movimentoes;
        }

        // GET: odata/Movimento(5)
        [EnableQuery]
        public SingleResult<Movimento> GetMovimento([FromODataUri] int key)
        {
            return SingleResult.Create(db.Movimentoes.Where(movimento => movimento.IdMovimento == key));
        }

        // PUT: odata/Movimento(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Movimento> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Movimento movimento = await db.Movimentoes.FindAsync(key);
            if (movimento == null)
            {
                return NotFound();
            }

            patch.Put(movimento);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovimentoExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(movimento);
        }

        // POST: odata/Movimento
        public async Task<IHttpActionResult> Post(Movimento movimento)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Movimentoes.Add(movimento);
            await db.SaveChangesAsync();

            return Created(movimento);
        }

        // PATCH: odata/Movimento(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Movimento> patch)
        {
          //  Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Movimento movimento = await db.Movimentoes.FindAsync(key);
            if (movimento == null)
            {
                return NotFound();
            }

            patch.Patch(movimento);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovimentoExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(movimento);
        }

        // DELETE: odata/Movimento(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Movimento movimento = await db.Movimentoes.FindAsync(key);
            if (movimento == null)
            {
                return NotFound();
            }

            db.Movimentoes.Remove(movimento);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Movimento(5)/Carteira
        [EnableQuery]
        public SingleResult<Carteira> GetCarteira([FromODataUri] int key)
        {
            return SingleResult.Create(db.Movimentoes.Where(m => m.IdMovimento == key).Select(m => m.Carteira));
        }

        // GET: odata/Movimento(5)/Posicao
        [EnableQuery]
        public SingleResult<Posicao> GetPosicao([FromODataUri] int key)
        {
            return SingleResult.Create(db.Movimentoes.Where(m => m.IdMovimento == key).Select(m => m.Posicao));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MovimentoExists(int key)
        {
            return db.Movimentoes.Count(e => e.IdMovimento == key) > 0;
        }
    }
}
