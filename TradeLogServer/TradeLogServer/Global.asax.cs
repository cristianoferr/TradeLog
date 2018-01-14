using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace TradeLogServer
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        protected void Application_Start()
        {

            log.Info("Application Start");
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

    /*   protected void Application_OnBeginRequest()
        {
            var res = HttpContext.Current.Response;
            var req = HttpContext.Current.Request;
           // res.AppendHeader("Access-Control-Allow-Origin", (req.Headers["Origin"] == null ? "*" : req.Headers["Origin"]));
            res.AppendHeader("Access-Control-Allow-Credentials", "true");
//            res.AppendHeader("Access-Control-Allow-Headers", "MaxDataServiceVersion, sap-contextid-accept, Authorization, Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name");
            res.AppendHeader("Access-Control-Allow-Methods", "POST,GET,PUT,PATCH,DELETE,OPTIONS");

        }*/
    }
}
