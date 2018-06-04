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
            builder.Namespace = "TradeLogServer.Controllers";

            builder.EntitySet<Carteira>("Carteira");
            builder.EntitySet<Posicao>("Posicao");
            builder.EntitySet<Movimento>("Movimento");
            builder.EntitySet<Papel>("Papel");
            builder.EntitySet<Usuario>("Usuario");
            builder.EntitySet<Trade>("Trade");
            builder.EntitySet<Balanco>("Balanco");
            builder.EntitySet<Evolucao>("Evolucao");

            //Mapeando navigation properties
            builder.EntitySet<Carteira>("Carteira").EntityType.Function("Posicao").ReturnsFromEntitySet<Posicao>("Posicao");
            builder.EntitySet<Carteira>("Carteira").EntityType.Function("PosicaoFechada").ReturnsFromEntitySet<Posicao>("Posicao");
            builder.EntitySet<Carteira>("Carteira").EntityType.Function("Balanco").ReturnsFromEntitySet<Balanco>("Balanco");
            builder.EntitySet<Carteira>("Carteira").EntityType.Function("Movimento").ReturnsFromEntitySet<Movimento>("Movimento");
            builder.EntitySet<Carteira>("Carteira").EntityType.Function("Evolucao").ReturnsFromEntitySet<Evolucao>("Evolucao");
            builder.EntitySet<Posicao>("Posicao").EntityType.Function("Trade").ReturnsFromEntitySet<Trade>("Trade");
            builder.EntitySet<Papel>("Papel").EntityType.Function("Posicao").ReturnsFromEntitySet<Posicao>("Posicao");

           /* var function = builder.EntitySet<Balanco>("Balanco").EntityType.Function("Balancos");
            function.Parameter<int>("IdCarteira");
            function.ReturnsCollectionFromEntitySet<Balanco>("Balanco");*/


            //método chamado para atualizar os valores
            builder.EntitySet<Papel>("Papel").EntityType.Function("UpdateValores").Returns<String>();
             builder.EntitySet<Evolucao>("Evolucao").EntityType.Function("UpdateEvolucao").Returns<String>();

             CriaActionsUsuario(builder);
             CriaActionsCarteira(builder);
             CriaActionsBalanco(builder);
             CriaActionsPapel(builder);
             CriaActionsPosicao(builder);
             CriaActionsTrade(builder);

             //registrando propriedades calculadas
             RegistaPropriedadesPosicao(builder);
             RegistraPropriedadesCarteira(builder);
             RegistraPropriedadesTrade(builder);
             RegistraPropriedadesPapel(builder);
             RegistaPropriedadesBalanco(builder);

             builder.EntityType<Evolucao>().Property(a => a.ValorTotal);

             builder.EntityType<Movimento>().Property(a => a.CodigoPapel);



             IEdmModel model = builder.GetEdmModel();

             return model;
         }

         private static void CriaActionsBalanco(ODataModelBuilder builder)
         {

            ActionConfiguration action = CreateAction<Balanco>(builder, "RemoveBalanco");
             action.Parameter<int>("IdCarteira");
             action.Parameter<int>("IdPapel");

             action = CreateAction<Balanco>(builder, "AdicionaBalanco");
             action.Parameter<int>("IdCarteira");
             action.Parameter<int>("IdPapel");
         }

         private static void RegistraPropriedadesPapel(ODataModelBuilder builder)
         {
         }

         private static void RegistaPropriedadesBalanco(ODataModelBuilder builder)
         {
             builder.EntityType<Balanco>().Property(a => a.CodigoPapel);
             builder.EntityType<Balanco>().Property(a => a.ValorPapel);
             builder.EntityType<Balanco>().Property(a => a.ValorAtual);
             builder.EntityType<Balanco>().Property(a => a.QtdPosse);
            builder.EntityType<Balanco>().Property(a => a.BoolCongelado);
            
         }

         private static void RegistraPropriedadesTrade(ODataModelBuilder builder)
         {
             builder.EntityType<Trade>().Property(a => a.ValorTrade);

         }

         private static void RegistraPropriedadesCarteira(ODataModelBuilder builder)
         {
             builder.EntityType<Carteira>().Property(a => a.ValorAtual);
             builder.EntityType<Carteira>().HasMany(a => a.Posicao);
            builder.EntityType<Carteira>().HasMany(a => a.PosicaoFechada);

            builder.EntityType<Carteira>().Property(a => a.ValorSaldoAtual);
             builder.EntityType<Carteira>().Property(a => a.ValorMedioCompra);
             builder.EntityType<Carteira>().Property(a => a.ValorMedioVenda);
            
            builder.EntityType<Carteira>().Property(a => a.ValorRiscoPosicoes);
             builder.EntityType<Carteira>().Property(a => a.ValorRiscoMaximoCarteira);
             builder.EntityType<Carteira>().Property(a => a.SaldoRiscoCarteira);
             builder.EntityType<Carteira>().Property(a => a.PercRiscoAtual);
             builder.EntityType<Carteira>().Property(a => a.PerdaMaximaTrade);
             builder.EntityType<Carteira>().Property(a => a.RiscoAtual);

         }

         private static void RegistaPropriedadesPosicao(ODataModelBuilder builder)
         {
             builder.EntityType<Posicao>().Property(a => a.PrecoAtual);
             builder.EntityType<Posicao>().Property(a => a.ValorSaldo);
             builder.EntityType<Posicao>().Property(a => a.NomePapel);
             builder.EntityType<Posicao>().Property(a => a.QuantidadeLiquida);
             builder.EntityType<Posicao>().Property(a => a.CodigoPapel);
             builder.EntityType<Posicao>().Property(a => a.TotalComprado);
             builder.EntityType<Posicao>().Property(a => a.TotalVendido);
             builder.EntityType<Posicao>().Property(a => a.ValorPosicaoAtual);
             builder.EntityType<Posicao>().Property(a => a.DiferencaAtual);
             builder.EntityType<Posicao>().Property(a => a.ValorMedioCompra);

             builder.EntityType<Posicao>().Property(a => a.ValorMedioVenda);


         }


         private static void CriaActionsUsuario(ODataModelBuilder builder)
         {
             ActionConfiguration action = CreateAction<Usuario>(builder, "VerificaUsuario");
             action.Parameter<string>("email");
             action.Parameter<string>("googleId");
             action.Parameter<string>("name");
             action.Parameter<string>("id_token");

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
             action.Parameter<bool>("IsClosing");
         }


         private static void CriaActionsPapel(ODataModelBuilder builder)
         {
            ActionConfiguration action = CreateAction<Papel>(builder, "CadastraPapel");
            action.Parameter<string>("Codigo");
            action.Parameter<string>("Nome");
            action.Parameter<int>("LotePadrao");
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
 