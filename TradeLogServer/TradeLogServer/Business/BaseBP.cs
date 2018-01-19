using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BaseBP<TModel> where TModel:BaseModel
    {
        public ApplicationDbContext db { get; set; }

        public BaseBP()
        {
        }

        internal void SalvaDados()
        {
            try
            {
                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

    }
}