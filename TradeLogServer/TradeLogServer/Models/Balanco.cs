using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TradeLogServer.Models
{
    [Table("Balanco")]
    public class Balanco : BaseModel
    {
        [Key, Column(Order = 0),ForeignKey("Carteira")]
        public int IdCarteira { get; set; }
        public Carteira Carteira { get; set; }

        [Key, Column(Order = 1), ForeignKey("Papel")]
        public int IdPapel { get; set; }
        public Papel Papel { get; set; }


        public float PesoPapel { get; set; }
        public string FlagCongelado { get; set; }

    }
}