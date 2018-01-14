using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TradeLogServer.Models
{
    [Table("Posicao")]
    public class Posicao : BaseModel
    {
        [Key]
        public int IdPosicao { get; set; }

        public int IdPapel { get; set; }
        [ForeignKey("IdPapel")]
        [Required]
        public Papel Papel{ get; set; }

        public int IdUsuario { get; set; }
        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }

        public int IdCarteira { get; set; }
        [ForeignKey("IdCarteira")]
        public Carteira Carteira { get; set; }

        public float PrecoEntrada{ get; set; }
        public float ValorEntrada { get; set; }
        public float PrecoSaida{ get; set; }
        public int Quantidade { get; set; }
        public float PrecoStop { get; set; }

        public DateTime DataEntrada { get; set; }
        public DateTime? DataSaida{ get; set; }

        [NotMapped]
        public float PrecoAtual { get { return Papel.ValorAtual; } }
    }
}