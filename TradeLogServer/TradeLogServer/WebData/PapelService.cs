using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace TradeLogServer.WebData
{
    public class PapelService
    {
        const string URL_SERVICO= "https://query1.finance.yahoo.com/v8/finance/chart/ACAO?range=1d&includePrePost=false&interval=1d&corsDomain=finance.yahoo.com&.tsrc=finance";

        public static JObject RequestData(string papel)
        {
            papel = papel.Replace("_", "%5E");
            string url = "";
           
                url = URL_SERVICO.Replace("ACAO", papel);
            JObject saida = Utils.Utils.LoadFromWeb(url);
           return saida;
        }

        

        

    }
}