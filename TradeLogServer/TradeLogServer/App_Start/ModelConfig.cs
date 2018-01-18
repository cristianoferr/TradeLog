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
using Microsoft.OData.Edm;
using System.Web.Http.OData.Routing;

namespace TradeLogServer.App_Start
{
    public static class ModelConfig
    {

        public static Microsoft.OData.Edm.IEdmModel GetModel()
        {
            ODataModelBuilder builder = new ODataConventionModelBuilder();

            builder.EntitySet<Posicao>("Posicao");
            var carteira=builder.EntitySet<Carteira>("Carteira");
            builder.EntitySet<Movimento>("Movimento");
            builder.EntitySet<Papel>("Papel");
            builder.EntitySet<Usuario>("Usuario");

            //Mapeando navigation properties
            builder
                  .EntitySet<Carteira>("Carteira")
                  .EntityType
                  .Function("Posicao")
                  .ReturnsFromEntitySet<Posicao>("Posicao");

            builder
                  .EntitySet<Carteira>("Carteira")
                  .EntityType
                  .Function("DepositaFundos")
                  .Returns<string>();

            builder
                  .EntitySet<Carteira>("Carteira")
                  .EntityType
                  .Function("RetiraFundos")
                  .Returns<string>();

            builder
                  .EntitySet<Papel>("Papel")
                  .EntityType
                  .Function("Update")
                  .Returns<string>();

            //registrando propriedades calculadas
            builder.EntityType<Posicao>().Property(a => a.PrecoAtual);
            builder.EntityType<Posicao>().Property(a => a.ValorAtual);
            builder.EntityType<Posicao>().Property(a => a.NomePapel);
            builder.EntityType<Posicao>().Property(a => a.CodigoPapel);

            builder.EntityType<Carteira>().Property(a => a.ValorAtual);


            builder.EntityType<Carteira>().HasMany(a => a.Posicao);

            /*carteira.HasNavigationPropertyLink(carteira.EntityType.NavigationProperties.First(np => np.Name == "Posicao"),
            (context, navigation) =>
            {
                return new Uri(context.Url.ODataLink(new EntitySetPathSegment("Posicao"), new KeyValuePathSegment(context.ResourceInstance.Posicao.IdPosicao.ToString())));
            }, followsConventions: false);
            */

            //builder.EntityType<Carteira>().ContainsMany(m => m.Posicao);



            builder.Namespace = "TradeLogServer.Controllers";

            IEdmModel model =builder.GetEdmModel();
            /*
            var carteira = (EdmEntitySet)model.EntityContainer.FindEntitySet("Carteira");
            var posicao = (EdmEntitySet)model.EntityContainer.FindEntitySet("Posicao");
            var carteiraType = (EdmEntityType)model.FindDeclaredType("TradeLogServer.Models.Carteira");
            var posicaoType = (EdmEntityType)model.FindDeclaredType("TradeLogServer.Models.Posicao");

            var partsProperty = new EdmNavigationPropertyInfo();
            partsProperty.TargetMultiplicity = EdmMultiplicity.Many;
            partsProperty.Target = posicaoType;
            partsProperty.ContainsTarget = false;
            partsProperty.OnDelete = EdmOnDeleteAction.None;
            partsProperty.Name = "Posicao";

            var navigationProperty = carteiraType.AddUnidirectionalNavigation(partsProperty);
            carteira.AddNavigationTarget(navigationProperty, posicao);*/

            return model;
        }
    }
}