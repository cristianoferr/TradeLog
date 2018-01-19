using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TradeLogServer.Models
{
    [Table("Movimento")]
    public class Movimento : BaseModel
    {
        [Key]
        public int IdMovimento { get; set; }

        public int IdCarteira { get; set; }
        [ForeignKey("IdCarteira")]
        public Carteira Carteira { get; set; }

        public int? IdPosicao { get; set; }
        [ForeignKey("IdPosicao")]
        public Posicao Posicao { get; set; }

        public string Descricao { get; set; }
        public float ValorMovimento { get; set; }
        public DateTime? DataMovimento { get; set; }

        [NotMapped]
        public string CodigoPapel
        {
            get
            {
                return Posicao == null ? "" : Posicao.Papel.Codigo;
            }
        }
    }
}