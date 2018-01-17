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
            JObject saida = PapelService.LoadFromWeb(url);
           return saida;
        }

        public static JObject LoadFromWeb( string url)
        {
            WebProxy myProxy = CreateProxy();


            WebRequest request = WebRequest.Create(url);
            request.Credentials = CredentialCache.DefaultCredentials;
            request.Proxy = myProxy;

            WebResponse response = request.GetResponse();
            Stream dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string responseFromServer = reader.ReadToEnd();

            reader.Close();
            response.Close();
            JObject json = JObject.Parse(responseFromServer);
            return json;

        }

        private static WebProxy CreateProxy()
        {
            string proxy = Environment.GetEnvironmentVariable("HTTP_PROXY");
            if (proxy == null || proxy == "")
                return null;

            WebProxy myProxy = new WebProxy();
            Uri newUri = new Uri(proxy.Contains("http") ? proxy : "http://" + proxy);
            myProxy.Address = newUri;
            return myProxy;
        }

    }
}