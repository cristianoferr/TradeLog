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
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.OData;
using System.Web.OData.Routing;
using System.Web.SessionState;
using TradeLogServer.Business;
using TradeLogServer.Handlers;
using TradeLogServer.Models;

namespace TradeLogServer.Controllers
{
    public class CarteiraController : BaseController<Carteira,BPCarteira>
    {
        // GET: odata/Carteira
        [EnableQuery]
        public IQueryable<Carteira> GetCarteira()
        {
            var current2 = HttpContextProvider.Current;
            var current = HttpContext.Current;
            HttpContextWrapper context = Request.Properties["MS_HttpContext"] as HttpContextWrapper;
            return db.Carteiras.Where(carteira => carteira.IdUsuario == idUsuarioAtual).Include(p => p.Posicao.Select(x=>x.Papel)).Include(p=>p.Posicao.Select(x=>x.Trade)).OrderBy(p=>p.NomeCarteira);
        }

        // GET: odata/Carteira(5)
        [EnableQuery]
        public SingleResult<Carteira> GetCarteira([FromODataUri] int key)
        {
            return SingleResult.Create(db.Carteiras.Where(carteira => carteira.IdCarteira == key && carteira.IdUsuario==idUsuarioAtual).Include(p => p.Posicao.Select(x => x.Papel)).Include(p => p.Posicao.Select(x => x.Trade)));
        }


        [HttpPost]
        public IHttpActionResult DepositaFundos(ODataActionParameters parameters)
        {
            string saida="Fundos Depositados:" + parameters["valor"] + "  com descricao: " + parameters["descricao"];
            string err = "";
            bool resultado = bp.MovimentaFundo(out err, idUsuarioAtual,(int)parameters["IdCarteira"], (float)parameters["valor"],(string)parameters["descricao"],null,true);
            return resultado ? (IHttpActionResult)Ok(saida): (IHttpActionResult)BadRequest(err);

        }

        [HttpPost]
        public IHttpActionResult RetiraFundos(ODataActionParameters parameters)
        {
            string saida = "Fundos Retirados:" + parameters["valor"] + "  com descricao: " + parameters["descricao"];
            string err = "";
            bool resultado = bp.MovimentaFundo(out err, idUsuarioAtual, (int)parameters["IdCarteira"], -(float)parameters["valor"], (string)parameters["descricao"], null, true);
            return resultado ? (IHttpActionResult)Ok(saida) : (IHttpActionResult)BadRequest(err);
        }


        // GET: odata/Carteira(5)/Evolucao
        [EnableQuery]
        [HttpGet]
        //[ODataRoute("Carteira({key})/Evolucao")]
        public IQueryable<Evolucao> Evolucao([FromODataUri] int key)
        {
            return db.Evolucaos.Where(evolucao => evolucao.IdCarteira == key && evolucao.Carteira.IdUsuario == idUsuarioAtual ).Include(p => p.Carteira).OrderBy(x=>x.IdEvolucao);
        }

        // GET: odata/Carteira(5)/Posicao
        [EnableQuery(EnsureStableOrdering = false)]
        [HttpGet]
        [ODataRoute("Carteira({key})/Posicao")]
        public IQueryable<Posicao> Posicao([FromODataUri] int key)
        {
            return db.Posicoes.Where(posicao => posicao.IdCarteira==key && posicao.IdUsuario==idUsuarioAtual && posicao.FlagAtivo == "T").Include(p => p.Papel).Include(p => p.Trade).OrderBy(p=>p.Papel.Codigo);
        }

        // GET: odata/Carteira(5)/PosicaoFechada
        [EnableQuery(EnsureStableOrdering = false)]
        [HttpGet]
        [ODataRoute("Carteira({key})/PosicaoFechada")]
        public IQueryable<Posicao> PosicaoFechada([FromODataUri] int key)
        {
            return db.Posicoes.Where(posicao => posicao.IdCarteira == key && posicao.IdUsuario == idUsuarioAtual && posicao.FlagAtivo == "F").Include(p => p.Papel).Include(p => p.Trade).OrderByDescending(p => p.DataSaida);
        }

        // GET: odata/Carteira(5)/Movimento
        [HttpGet]
        //[ODataRoute("Carteira({key})/Movimento")]
        public IQueryable<Movimento> Movimento([FromODataUri] int key)
        {
            return db.Movimentoes.Where(movimento => movimento.IdCarteira == key && movimento.Carteira.IdUsuario == idUsuarioAtual).Include(p => p.Carteira).Include(p => p.Posicao.Papel).Include(p => p.Posicao.Trade);
        }

        // GET: odata/Carteira(5)/Balanco
        [HttpGet]
        //[ODataRoute("Carteira({key})/Balanco")]
        public IQueryable<Balanco> Balanco([FromODataUri] int key)
        {
            return db.Balancos.Where(balanco=>balanco.IdCarteira== key && balanco.Carteira.IdUsuario == idUsuarioAtual).Include(p => p.Carteira).Include(p => p.Carteira.Posicao).Include(p => p.Carteira.Posicao.Select(x => x.Papel)).Include(p => p.Papel).OrderBy(p => p.Papel.Codigo); ;
        }


        // PUT: odata/Carteira(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Carteira> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid || idUsuarioAtual == -1)
            {
                return BadRequest(ModelState);
            }

            Carteira carteira = await db.Carteiras.FindAsync(key);
            if (carteira == null || carteira.IdUsuario != idUsuarioAtual)
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
        public async Task<IHttpActionResult> Post([FromBody]Carteira carteira)
        {
            if (idUsuarioAtual == -1)
            {
                return BadRequest("invalid_user");
            }
            if (carteira == null) return BadRequest("Empty Carteira");
            carteira.IdUsuario = idUsuarioAtual;
            if (!IsUnique(carteira) )
            {
                return BadRequest("repeated_name");
            }
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();
                return BadRequest(ModelState);
            }

            float valorLiquido = carteira.ValorLiquido;
            carteira.ValorLiquido = 0;
            db.Carteiras.Add(carteira);
            carteira.TotalMovimentado = valorLiquido;

            db.SaveChanges();
            string saida = "";
            bp.MovimentaFundo(out saida, idUsuarioAtual, carteira.IdCarteira, valorLiquido, "Lançamento Inicial de " + valorLiquido, null);

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
            //Validate(patch.GetEntity());
            if (idUsuarioAtual == -1)
            {
                return BadRequest("invalid_user");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Carteira carteira = await db.Carteiras.FindAsync(key);
            if (carteira == null || carteira.IdUsuario != idUsuarioAtual)
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
            if (idUsuarioAtual == -1)
            {
                return BadRequest("invalid_user");
            }
            Carteira carteira = await db.Carteiras.FindAsync(key);
            if (carteira == null || carteira.IdUsuario != idUsuarioAtual)
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
            return SingleResult.Create(db.Carteiras.Where(m => m.IdCarteira == key && m.IdUsuario==idUsuarioAtual).Select(m => m.Usuario));
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
