using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.OData.Builder;

namespace TradeLogServer.Models
{
    [Table("Posicao")]
    public class Posicao : BaseModel
    {
        [Key]
        public int IdPosicao { get; set; }

        [ForeignKey("Papel")]
        public int IdPapel { get; set; }
        [Required]
        public  Papel Papel { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public  Usuario Usuario { get; set; }

        [ForeignKey("Carteira")]
        public int IdCarteira { get; set; }
        public  Carteira Carteira { get; set; }

        public float PrecoEntrada{ get; set; }
        public float ValorEntrada { get; set; }
        public float PrecoSaida{ get; set; }
        public int Quantidade { get; set; }
        public float PrecoStop { get; set; }

        public DateTime DataEntrada { get; set; }
        public DateTime? DataSaida{ get; set; }

        [NotMapped]
        public float PrecoAtual { get { return Papel.ValorAtual; } }
        [NotMapped]
        public float ValorAtual { get { return PrecoAtual*Quantidade; } }
    }
}