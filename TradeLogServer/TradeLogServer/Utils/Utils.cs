using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace TradeLogServer.Utils
{
    public class Utils
    {

        public const int DIRECAO_COMPRA = 1;
        public const int DIRECAO_VENDA = -1;
        public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }

        public static WebProxy CreateProxy()
        {
            string proxy = Environment.GetEnvironmentVariable("HTTP_PROXY");
            if (proxy == null || proxy == "")
                return null;

            WebProxy myProxy = new WebProxy();
            Uri newUri = new Uri(proxy.Contains("http") ? proxy : "http://" + proxy);
            myProxy.Address = newUri;
            return myProxy;
        }

        public static JObject LoadFromWeb(string url)
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
    }
}