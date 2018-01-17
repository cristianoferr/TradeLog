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
    builder.EntitySet<Historico>("Historico");
    builder.EntitySet<Papel>("Papels"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class HistoricoController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

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

        // PUT: odata/Historico(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Historico> patch)
        {
           // Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Historico historico = await db.Historicoes.FindAsync(key);
            if (historico == null)
            {
                return NotFound();
            }

            patch.Put(historico);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HistoricoExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(historico);
        }

        // POST: odata/Historico
        public async Task<IHttpActionResult> Post(Historico historico)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Historicoes.Add(historico);
            await db.SaveChangesAsync();

            return Created(historico);
        }

        // PATCH: odata/Historico(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Historico> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Historico historico = await db.Historicoes.FindAsync(key);
            if (historico == null)
            {
                return NotFound();
            }

            patch.Patch(historico);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HistoricoExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(historico);
        }

        // DELETE: odata/Historico(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Historico historico = await db.Historicoes.FindAsync(key);
            if (historico == null)
            {
                return NotFound();
            }

            db.Historicoes.Remove(historico);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
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
