using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPPosicao : BaseBP<Posicao>
    {
        internal bool FechaPosicao(out string err, int idUsuarioAtual, int v1, float v2)
        {
            throw new NotImplementedException();
        }
    }
}