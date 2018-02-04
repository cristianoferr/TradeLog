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
   
    public class MovimentoController : BaseController<Movimento,BPMovimento>
    {
        // GET: odata/Movimento
        [EnableQuery]
        public IQueryable<Movimento> GetMovimento()
        {

            return db.Movimentoes.Where(movimento => movimento.Carteira.IdUsuario==idUsuarioAtual).Include(x=>x.Carteira);
        }

        // GET: odata/Movimento(5)
        [EnableQuery]
        public SingleResult<Movimento> GetMovimento([FromODataUri] int key)
        {
            return SingleResult.Create(db.Movimentoes.Where(movimento => movimento.IdMovimento == key && movimento.Carteira.IdUsuario == idUsuarioAtual).Include(x => x.Carteira));
        }

        // PUT: odata/Movimento(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Movimento> patch)
        {
            //Validate(patch.GetEntity());
            if (idUsuarioAtual == -1)
            {
                return BadRequest("invalid_user");
            }

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
            if (idUsuarioAtual == -1)
            {
                return BadRequest("invalid_user");
            }

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
            if (idUsuarioAtual == -1)
            {
                return BadRequest("invalid_user");
            }

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

      

        // GET: odata/Movimento(5)/Carteira
        [EnableQuery]
        public SingleResult<Carteira> GetCarteira([FromODataUri] int key)
        {
            return SingleResult.Create(db.Movimentoes.Where(m => m.IdMovimento == key && m.Carteira.IdUsuario == idUsuarioAtual).Include(x => x.Carteira).Select(m => m.Carteira));
        }

        // GET: odata/Movimento(5)/Posicao
        [EnableQuery]
        public SingleResult<Posicao> GetPosicao([FromODataUri] int key)
        {
            return SingleResult.Create(db.Movimentoes.Where(m => m.IdMovimento == key && m.Carteira.IdUsuario==idUsuarioAtual).Include(x=>x.Carteira).Select(m => m.Posicao));
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
