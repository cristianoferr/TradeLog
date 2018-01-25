using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using TradeLogServer.Models;
using TradeLogServer.Controllers;
using TradeLogServer.Formatters;
using System.Net;
using System.Threading.Tasks;
using System.Threading;
using System.Web.Http.OData.Batch;
using System.Web.OData.Routing;
using System.Web.Http.Batch;
using System.Web.Http.OData.Formatter;
using TradeLogServer.App_Start;
using TradeLogServer.Handlers;

namespace TradeLogServer
{

    public class AllowOptionsHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
        {
            /*if (request.Method == HttpMethod.Options)
            {
                request.Method = HttpMethod.Get;
            }*/
            if (request.RequestUri.AbsoluteUri.Contains("$batch"))
            {
                // request.Content.Headers.Add("Content-Type", "multipart/mixed; boundary=changeset_77162fcd-b8da-41ac-a9f8-9357efbbd621");
                request.Content.Headers.Add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,OData-Version");
            }
            else
            {
               //request.Headers.Remove("Accept");
              //  request.Headers.Add("Accept", "application/json;odata.metadata=minimal;odata.streaming=true");
            }


            var response = await base.SendAsync(request, cancellationToken);

            if (request.Method == HttpMethod.Options)
            {
                response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Headers.Add("Access-Control-Request-Headers", "content-type,mime-version,odata-maxversion,odata-version,x-csrf-token");
                response.Headers.Add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,OData-Version,MIME-Version, OData-MaxVersion");
            }

            return response;
        }
    }

    

public static class WebApiConfig
    {
        

        public static void Register(HttpConfiguration config)
        {
            config.AddODataQueryFilter();
            config.MessageHandlers.Add(new AllowOptionsHandler());

            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            //This line is aaded for $select, $count,$filter, $top and $select
            config.Count().Filter().OrderBy().Expand().Select().MaxTop(null);

            MapApiRoutes(config);

            config.MapHttpAttributeRoutes();

            MapOdataRoutes(config);

            config.EnsureInitialized();

        }

        private static void MapOdataRoutes(HttpConfiguration config)
        {
            string routeName = "odata";

            System.Web.OData.Batch.ODataBatchHandler odataBatchHandler = new System.Web.OData.Batch.DefaultODataBatchHandler(GlobalConfiguration.DefaultServer);

            ODataRoute route = config.MapODataServiceRoute(routeName, routeName, 
                model: ModelConfig.GetModel(),
                batchHandler: odataBatchHandler);
            

        }

        private static void MapApiRoutes(HttpConfiguration config)
        {
            // Web API routes
            config.Routes.MapHttpRoute(
                 name: "DefaultApi",
                 routeTemplate: "api/{controller}/{id}",
                 defaults: new { id = RouteParameter.Optional }
             );

            config.Routes.MapHttpRoute(
                name: "ActionAPI",
                routeTemplate: "api/{controller}/{action}/{id}"
            );

            config.Routes.MapHttpRoute(
               name: "ActionAPISemParam",
               routeTemplate: "api/{controller}/{action}"
           );
        }
    }
}

