using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using TradeLogServer.Models;
using TradeLogServer.WebData;

namespace TradeLogServer.Business
{
    public class BPPapel : BaseBP<Papel>
    {
        internal string UpdateHistoricoDoPapel(int key)
        {
            string saida = "Updating:\n ";
            IList<Papel> papeis = db.Papels.ToList();
            foreach (Papel papel in papeis)
            {
                saida += papel.Codigo;
                saida = UpdateHistorico(papel, saida);
                saida += "\n";
            }

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return saida;
        }


        private string UpdateHistorico(Papel papel, string saida)
        {
            try
            {
                JObject saidaJson = PapelService.RequestData(papel.Codigo);
                float close = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["close"][0];
                float high = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["high"][0];
                float low = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["low"][0];
                float open = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["open"][0];
                float volume = (float)saidaJson["chart"]["result"][0]["indicators"]["quote"][0]["volume"][0];
                double timestamp = (double)saidaJson["chart"]["result"][0]["timestamp"][0];
                papel.ValorAtual = close;

                DateTime data = Utils.Utils.UnixTimeStampToDateTime(timestamp);
                papel.LastUpdate = data;
                papel.LastUpdateMessage = "OK";
                Historico historico = GetHistoricoForPapel(papel, data);
                historico.Close = close;
                historico.High = high;
                historico.Open = open;
                historico.Low = low;
                historico.Volume = volume;

                saida += " OK";
            }
            catch (Exception e)
            {
                saida += " ERROR: " + e.ToString();
            }

            return saida;
        }

        private Historico GetHistoricoForPapel(Papel papel, DateTime lastUpdate)
        {

            Historico hist = db.Historicoes.Where(h => h.Papel.IdPapel == papel.IdPapel && h.Data.Day == lastUpdate.Day && h.Data.Month == lastUpdate.Month && h.Data.Year == lastUpdate.Year).FirstOrDefault();
            if (hist == null)
            {
                hist = new Historico();
                hist.Papel = papel;
                hist.IdPapel = papel.IdPapel;
                hist.Data = lastUpdate;
                db.Historicoes.Add(hist);

            }
            return hist;
        }

    }
}