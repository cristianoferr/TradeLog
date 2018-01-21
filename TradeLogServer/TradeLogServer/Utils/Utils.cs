using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}