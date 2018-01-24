using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.WebHost;
using System.Web.Routing;
using System.Web.SessionState;

namespace TradeLogServer.Handlers
{
    public class SessionHttpControllerHandler
  : HttpControllerHandler, IRequiresSessionState
    {
        public SessionHttpControllerHandler(RouteData routeData) : base(routeData)
        {
        }
    }

    public class SessionHttpControllerRouteHandler : HttpControllerRouteHandler
    {
        protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            return new SessionHttpControllerHandler(requestContext.RouteData);
        }
    }
    /*
    public class ValuesController : ApiController
    {
        public string GET(string input)
        {
            var session = HttpContext.Current.Session;
            if (session != null)
            {
                if (session["Time"] == null)
                {
                    session["Time"] = DateTime.Now;
                }
                return "Session Time: " + session["Time"] + input;
            }
            return "Session is not availabe" + input;
        }
    }*/
}