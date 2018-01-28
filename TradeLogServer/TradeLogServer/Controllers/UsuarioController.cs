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
using TradeLogServer.Business;
using TradeLogServer.Handlers;
using TradeLogServer.Models;

namespace TradeLogServer.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using TradeLogServer.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Usuario>("Usuario");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class UsuarioController : BaseController<Usuario,BPUsuario>
    {
        [HttpPost]
        public IHttpActionResult VerificaUsuario(ODataActionParameters parameters)
        {
            string email = (string)parameters["email"];
            if (email == null) return BadRequest("InvalidEmail");
            string googleId = (string)parameters["googleId"];
            string name = (string)parameters["name"];
            string id_token = (string)parameters["id_token"];
            string saida = "";
            int idUsuario= bp.AutenticaUsuario(out saida,email,googleId, name, id_token);
            if (idUsuario > 0)
            {
                Session["IdUsuario"]= idUsuario;
                return Ok(saida);
            }
            return BadRequest(saida);
        }

        [EnableQuery]
        [ActionName("get")]
        public SingleResult<Usuario> GetUsuarioLogado()
        {
            return SingleResult.Create(db.Usuarios.Where(usuario => usuario.IdUsuario == idUsuarioAtual));
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UsuarioExists(int key)
        {
            return db.Usuarios.Count(e => e.IdUsuario == key) > 0;
        }
    }
}
