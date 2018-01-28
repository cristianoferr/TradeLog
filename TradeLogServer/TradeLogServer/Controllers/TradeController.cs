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
using TradeLogServer.Business;
using TradeLogServer.Models;

namespace TradeLogServer.Controllers
{
   
    public class TradeController : BaseController<Trade, BPTrade>
    {

        // GET: odata/Trade
        [EnableQuery]
        public IQueryable<Trade> GetTrade()
        {
            return db.Trades;
        }

        // GET: odata/Trade(5)
        [EnableQuery]
        public SingleResult<Trade> GetTrade([FromODataUri] int key)
        {
            return SingleResult.Create(db.Trades.Where(trade => trade.IdTrade == key));
        }

        /*
         Realiza um trade 
         Direcao: 1=compra, -1=venda
             */
        [HttpPost]
        public IHttpActionResult ExecutaTrade(ODataActionParameters parameters)
        {
            int idPapel = (int)parameters["IdPapel"];
            string Direcao = (string)parameters["tipoOperacao"];
            int IdCarteira = (int)parameters["IdCarteira"];
            
            float PrecoAcao = (float)parameters["PrecoAcao"];
            int Quantidade = (int)parameters["quantidade"];
            float CustoOperacao = (float)parameters["custoOperacao"];
            float PrecoStopOpcional = (float)parameters["PrecoStopOpcional"];
            bool IsClosing = (bool)parameters["IsClosing"];


            string err = "";
            bool resultado = bp.ExecutaTrade(out err, IdCarteira,idUsuarioAtual, Direcao, idPapel, PrecoAcao, Quantidade, CustoOperacao, PrecoStopOpcional, IsClosing);
            
            if (resultado)
            {
                return Ok("Trade_ok");
            } else
            {
                return BadRequest(err);
            }
        }

           protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TradeExists(int key)
        {
            return db.Trades.Count(e => e.IdTrade == key) > 0;
        }
    }
}
