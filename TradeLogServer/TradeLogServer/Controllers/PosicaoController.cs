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
    public class PosicaoController : BaseController<Posicao>
    {
        // GET: odata/Posicao
        [EnableQuery]
        public SingleResult<Posicao> GetPosicao([FromODataUri] int key)
        {
            return SingleResult.Create(db.Posicoes.Where(posicao=>posicao.IdPosicao== key && posicao.IdUsuario==idUsuarioAtual).Include(p => p.Papel));
        }

        // GET: odata/Posicao(5)
        [EnableQuery]
        public IQueryable<Posicao> GetPosicao()
        {
            return db.Posicoes.Where(posicao => posicao.IdUsuario == idUsuarioAtual).Include(p => p.Papel);
        }

        /*
        // GET: odata/Posicao(5)
        [EnableQuery]
        public SingleResult<Posicao> Get([FromODataUri] int id)
        {
            return SingleResult.Create(db.Posicoes.Where(posicao => posicao.IdPosicao == id && posicao.IdUsuario == idUsuarioAtual));
        }*/


        // PUT: odata/Posicao(5)
        [HttpPut]
        public async Task<IHttpActionResult> Put([FromODataUri] int id, [FromBody] Delta<Posicao> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Posicao posicao = await db.Posicoes.FindAsync(id);
            if (posicao == null)
            {
                return NotFound();
            }
            if (posicao.IdUsuario != idUsuarioAtual)
            {
                return BadRequest("NO PERMISSION!");
            }

            patch.Put(posicao);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PosicaoExists(id))
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

        // POST: odata/Posicao
        [HttpPost]
        public async Task<IHttpActionResult> Post(Posicao posicao)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (posicao.Carteira.IdUsuario != idUsuarioAtual)
            {
                return BadRequest("NO PERMISSION!");
            }
            posicao.IdUsuario = idUsuarioAtual;

            db.Posicoes.Add(posicao);
            await db.SaveChangesAsync();

            // return Created(posicao);
            return Ok();
        }

        // PATCH: odata/Posicao(5)
        [AcceptVerbs("PATCH", "MERGE")]
        [HttpPatch]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Posicao> patch)
        {

          
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

      

        // DELETE: odata/Posicao(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Posicao posicao = await db.Posicoes.FindAsync(key);
            if (posicao.IdUsuario != idUsuarioAtual)
            {
                return BadRequest("NO PERMISSION!");
            }

            if (posicao == null)
            {
                return NotFound();
            }

            db.Posicoes.Remove(posicao);
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

        private bool PosicaoExists(int key)
        {
            return db.Posicoes.Count(e => e.IdPosicao == key) > 0;
        }
    }
}
