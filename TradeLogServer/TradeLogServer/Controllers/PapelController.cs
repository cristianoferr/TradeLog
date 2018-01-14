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
using System.Web.Http.OData.Routing;
using TradeLogServer.Models;

namespace TradeLogServer.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using TradeLogServer.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Papel>("Papel");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class PapelController : BaseController<Papel>
    {
        // GET: odata/Papel
        [EnableQuery]
        public IQueryable<Papel> GetPapel()
        {
            return db.Papels;
        }

        // GET: odata/Papel(5)
        [EnableQuery]
        public SingleResult<Papel> GetPapel([FromODataUri] int key)
        {
            return SingleResult.Create(db.Papels.Where(papel => papel.IdPapel == key));
        }

        // PUT: odata/Papel(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Papel> patch)
        {
           // Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Papel papel = await db.Papels.FindAsync(key);
            if (papel == null)
            {
                return NotFound();
            }

            patch.Put(papel);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PapelExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(papel);
        }

        // POST: odata/Papel
        public async Task<IHttpActionResult> Post(Papel papel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Papels.Add(papel);
            await db.SaveChangesAsync();

            return Created(papel);
        }

        // PATCH: odata/Papel(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Papel> patch)
        {
           // Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Papel papel = await db.Papels.FindAsync(key);
            if (papel == null)
            {
                return NotFound();
            }

            patch.Patch(papel);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PapelExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(papel);
        }

        // DELETE: odata/Papel(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Papel papel = await db.Papels.FindAsync(key);
            if (papel == null)
            {
                return NotFound();
            }

            db.Papels.Remove(papel);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
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
            return db.Papels.Count(e => e.IdPapel == key) > 0;
        }
    }
}
