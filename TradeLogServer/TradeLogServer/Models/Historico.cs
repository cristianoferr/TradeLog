using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.OData.Builder;

namespace TradeLogServer.Models
{
    [Table("Historico")]
    public class Historico : BaseModel
    {
        [Key]
        public int IdHistorico { get; set; }

        [ForeignKey("Papel")]
        public int IdPapel { get; set; }
        [Required]
        public  Papel Papel { get; set; }
        
        public float Open{ get; set; }
        public float High { get; set; }
        public float Low{ get; set; }
        public float Close { get; set; }
        public float Volume{ get; set; }

        public DateTime Data { get; set; }
    }
}