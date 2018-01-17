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
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.OData;
using System.Web.OData.Routing;
using TradeLogServer.Models;
using TradeLogServer.WebData;

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

        [HttpGet]
        [ODataRoute("Papel({key})/TradeLogServer.Controllers.Update")]
        public string Update([FromODataUri] int key)
        {
            // return db.Posicoes.Where(posicao => posicao.IdCarteira == key && posicao.IdUsuario == idUsuarioAtual).Include(p => p.Papel);

            string saida="Updating:\n ";
            IList<Papel> papeis=db.Papels.ToList();
            foreach (Papel papel in papeis)
            {
                saida += papel.Codigo ;
                saida=UpdateHistorico(papel,saida);
                saida += "\n";
            }

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
               throw;
            }


            return saida;
        }

        private string UpdateHistorico(Papel papel,string saida)
        {
            try
            {
                JObject saidaJson = PapelService.RequestData(papel.Codigo);
                float close = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["close"][0];
                float high = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["high"][0];
                float low = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["low"][0];
                float open = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["open"][0];
                float volume = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["volume"][0];
                double timestamp= (double)saidaJson["chart"]["result"][0]["timestamp"][0];
                papel.ValorAtual = close;

                DateTime data= Utils.Utils.UnixTimeStampToDateTime(timestamp);
                papel.LastUpdate = data;
                papel.LastUpdateMessage = "OK";
                Historico historico = GetHistoricoForPapel(papel, data);
                historico.Close = close;
                historico.High = high;
                historico.Open = open;
                historico.Low = low;
                historico.Volume = volume;

                saida += " OK";
            }
            catch (Exception e)
            {
                saida+=" ERROR: "+e.ToString();
            }

            return saida;
        }

        private Historico GetHistoricoForPapel(Papel papel, DateTime lastUpdate)
        {
            
            Historico hist = db.Historicoes.Where(h => h.Papel.IdPapel == papel.IdPapel && h.Data.Day == lastUpdate.Day && h.Data.Month == lastUpdate.Month && h.Data.Year == lastUpdate.Year).FirstOrDefault();
            if (hist == null)
            {
                hist = new Historico();
                hist.Papel = papel;
                hist.IdPapel = papel.IdPapel;
                hist.Data = lastUpdate;
                db.Historicoes.Add(hist);

            }
            return hist;
        }



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
/*
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
        */
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
