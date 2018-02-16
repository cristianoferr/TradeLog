using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TradeLogServer.Models
{
    [Table("Trade")]
    public class Trade : BaseModel
    {
        [Key]
        public int IdTrade { get; set; }

        [ForeignKey("Posicao")]
        public int IdPosicao { get; set; }
        public Posicao Posicao { get; set; }

        public float PrecoTrade { get; set; }

        [NotMapped]
        public float ValorTrade { get {
                return QuantidadeComprada > 0 ? QuantidadeComprada * PrecoTrade : QuantidadeVendida * PrecoTrade;
            }
        }

        public int QuantidadeComprada{ get; set; }
        public int QuantidadeVendida{ get; set; }

        /*Contem o custo  gasto em operacao*/
        public float CustoOperacao { get; set; }
        public DateTime Data { get; set; }
    }
}