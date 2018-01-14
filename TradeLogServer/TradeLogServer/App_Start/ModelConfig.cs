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

namespace TradeLogServer.App_Start
{
    public static class ModelConfig
    {

        public static Microsoft.OData.Edm.IEdmModel GetModel()
        {
            ODataModelBuilder builder = new ODataConventionModelBuilder();

            builder.EntitySet<Posicao>("Posicao");
            builder.EntitySet<Carteira>("Carteira");
            builder.EntitySet<Movimento>("Movimento");
            builder.EntitySet<Papel>("Papel");
            builder.EntitySet<Usuario>("Usuario");

            //Mapeando navigation properties
            builder
                  .EntitySet<Carteira>("Carteira")
                  .EntityType
                  .Function("Posicao")
                  .ReturnsFromEntitySet<Posicao>("Posicao");

            //registrando propriedades calculadas
            builder.EntityType<Posicao>().Property(a => a.PrecoAtual);
            builder.EntityType<Posicao>().Property(a => a.ValorAtual);

            //builder.EntityType<Posicao>().ContainsMany(m => m.Papel);

            builder.Namespace = "TradeLogServer.Controllers";

            return builder.GetEdmModel();
        }
    }
}