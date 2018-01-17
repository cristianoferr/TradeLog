using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TradeLogServer.Models
{
    [Table("Papel")]
    public class Papel : BaseModel
    {
        [Key]
        public int IdPapel { get; set; }
        public string Codigo{ get; set; }
        public string Nome{ get; set; }
        public float ValorAtual{ get; set; }
        public DateTime? LastUpdate { get; set; }
        public string LastUpdateMessage { get; set; }
    }
}