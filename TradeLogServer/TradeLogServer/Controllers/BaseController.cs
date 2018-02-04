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
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.ModelBinding;
using System.Web.OData;
using System.Web.OData.Extensions;
using System.Web.OData.Routing;
using System.Web.Routing;
using System.Web.SessionState;
using TradeLogServer.Business;
using TradeLogServer.Models;

namespace TradeLogServer.Controllers
{
    
    public class BaseController<TModel,TBP> : ODataController, IRequiresSessionState
        where TModel : BaseModel
        where TBP:BaseBP<TModel>, new()

    {
        protected ApplicationDbContext db = new ApplicationDbContext();
        protected TBP bp;

        public HttpSessionStateBase Session
        {
            get
            {
                HttpContextWrapper context = Request.Properties["MS_HttpContext"] as HttpContextWrapper;
                return context.Session;

            }
        }

        public BaseController()
        {
            bp = new TBP();
            bp.db = db;
        }

        //TODO: ver como pega o usuário logado
        protected int idUsuarioAtual { get {
                var idUsuario = Session["IdUsuario"];
                if (idUsuario == null) return -1;
                return (int)idUsuario;
            }
        }



        public HttpResponseMessage Options()
        {
            return new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
        }

        protected void AplicaPatch(Dictionary<string, object> patch, TModel posicao)
        {
            var keys = patch.Keys.ToArray();
            foreach (string key in keys)
            {
                var value = patch[key];
                if (value.GetType().Name == "Double")
                {
                    value = Convert.ToSingle(value);
                }
                if (value.GetType().Name == "Int64")
                {
                    value = Convert.ToInt32(value);
                }
                /*  posicao.GetType().InvokeMember(key,
      BindingFlags.Instance | BindingFlags.Public | BindingFlags.SetProperty,Type.DefaultBinder, posicao, value);*/
                Type type = posicao.GetType();
                PropertyInfo prop = type.GetProperty(key);
                prop.SetValue(posicao, value, null);
            }
        }
    }
}
