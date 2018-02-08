using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TradeLogServer.Models
{
    [Table("Evolucao")]
    public class Evolucao : BaseModel
    {
        [Key]
        public int IdEvolucao { get; set; }
        public float ValorLiquido { get; set; }
        public float ValorPosicao { get; set; }

        [NotMapped]
        public float ValorTotal
        {
            get
            {
                return ValorLiquido + ValorPosicao;
            }
        }

        public DateTime Data { get; set; }

        [ForeignKey("Carteira")]
        public int? IdCarteira { get; set; }
        public Carteira Carteira { get; set; }



    }
}