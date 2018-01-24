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

            builder.EntitySet<Carteira>("Carteira");
            builder.EntitySet<Posicao>("Posicao");
            builder.EntitySet<Movimento>("Movimento");
            builder.EntitySet<Papel>("Papel");
            builder.EntitySet<Usuario>("Usuario");
            builder.EntitySet<Trade>("Trade");

            //Mapeando navigation properties
            builder.EntitySet<Carteira>("Carteira").EntityType.Function("Posicao").ReturnsFromEntitySet<Posicao>("Posicao");
            builder.EntitySet<Carteira>("Carteira").EntityType.Function("Movimento").ReturnsFromEntitySet<Movimento>("Movimento");
            builder.EntitySet<Posicao>("Posicao").EntityType.Function("Trade").ReturnsFromEntitySet<Trade>("Trade");

            builder.EntitySet<Papel>("Papel").EntityType.Function("Update").Returns<String>();

            CriaActionsUsuario(builder);
            CriaActionsCarteira(builder);
            CriaActionsPapel(builder);
            CriaActionsPosicao(builder);
            CriaActionsTrade(builder);

            //registrando propriedades calculadas
            RegistaPropriedadesPosicao(builder);
            RegistraPropriedadesCarteira(builder);
            RegistraPropriedadesTrade(builder);
            builder.EntityType<Movimento>().Property(a => a.CodigoPapel);

            builder.Namespace = "TradeLogServer.Controllers";

            IEdmModel model = builder.GetEdmModel();

            return model;
        }

        private static void RegistraPropriedadesTrade(ODataModelBuilder builder)
        {
            builder.EntityType<Trade>().Property(a => a.ValorTrade);
        }

        private static void RegistraPropriedadesCarteira(ODataModelBuilder builder)
        {
            builder.EntityType<Carteira>().Property(a => a.ValorAtual);
            builder.EntityType<Carteira>().HasMany(a => a.Posicao);
        }

        private static void RegistaPropriedadesPosicao(ODataModelBuilder builder)
        {
            builder.EntityType<Posicao>().Property(a => a.PrecoAtual);
            builder.EntityType<Posicao>().Property(a => a.ValorLiquido);
            builder.EntityType<Posicao>().Property(a => a.NomePapel);
            builder.EntityType<Posicao>().Property(a => a.QuantidadeLiquida);
            builder.EntityType<Posicao>().Property(a => a.CodigoPapel);
            builder.EntityType<Posicao>().Property(a => a.TotalComprado);
            builder.EntityType<Posicao>().Property(a => a.TotalVendido);
            builder.EntityType<Posicao>().Property(a => a.ValorPosicaoAtual);
            builder.EntityType<Posicao>().Property(a => a.DiferencaAtual);
        }


        private static void CriaActionsUsuario(ODataModelBuilder builder)
        {
            ActionConfiguration action = CreateAction<Usuario>(builder, "VerificaUsuario");
            action.Parameter<string>("email");
            action.Parameter<string>("googleId");
            action.Parameter<string>("name");
        }

            private static void CriaActionsTrade(ODataModelBuilder builder)
        {
            ActionConfiguration action = CreateAction<Trade>(builder, "ExecutaTrade");
            action.Parameter<int>("IdPapel");
            action.Parameter<string>("tipoOperacao");
            action.Parameter<int>("IdCarteira");
            action.Parameter<float>("PrecoAcao");
            action.Parameter<int>("quantidade");
            action.Parameter<float>("custoOperacao");
            action.Parameter<float>("PrecoStopOpcional");
        }


        private static void CriaActionsPapel(ODataModelBuilder builder)
        {
            ActionConfiguration action = CreateAction<Papel>(builder, "Update");
        }

        private static void CriaActionsPosicao(ODataModelBuilder builder)
        {
            ActionConfiguration action = CreateAction<Posicao>(builder, "FechaPosicao");
            action.Parameter<int>("IdPosicao");
            action.Parameter<float>("valorAcao");
            action.Parameter<float>("quantidadeFechada");
        }

            private static void CriaActionsCarteira(ODataModelBuilder builder)
        {
            ActionConfiguration action = CreateAction<Carteira>(builder, "DepositaFundos");
            action.Parameter<int>("IdCarteira");
            action.Parameter<float>("valor");
            action.Parameter<string>("descricao");

            action = CreateAction<Carteira>(builder, "RetiraFundos");
            action.Parameter<int>("IdCarteira");
            action.Parameter<float>("valor");
            action.Parameter<string>("descricao");
        }

        private static ActionConfiguration CreateAction<TModel>(ODataModelBuilder builder,string name)
            where TModel : BaseModel
        {
            return builder.EntityType<TModel>().Collection.Action(name);
        }
    }
}