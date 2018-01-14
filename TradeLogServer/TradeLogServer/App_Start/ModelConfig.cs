using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.OData.Builder;
using TradeLogServer.Models;

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

            builder
                  .EntitySet<Carteira>("Carteira")
                  .EntityType
                  .Function("Posicao")
                  .ReturnsFromEntitySet<Posicao>("Posicao");


            /*var function = builder.Function("GetCarteira");
            function.Parameter<int>("key");
            function.ReturnsCollectionFromEntitySet<Carteira>("Carteira");
            */
            builder.Namespace = "TradeLogServer.Controllers";

            /*EntitySetConfiguration<Person> persons = builder.EntitySet<Person>("Person");

            FunctionConfiguration myFirstFunction = persons.EntityType.Collection.Function("MyFirstFunction");
            myFirstFunction.ReturnsCollectionFromEntitySet<Person>("Person");*/

            return builder.GetEdmModel();
        }
    }
}