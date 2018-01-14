using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TradeLogServer.Models
{
    [Table("Carteira")]
    public class Carteira: BaseModel
    {
        [Key]
        public int IdCarteira { get; set; }

        public int IdUsuario { get; set; }
        [ForeignKey("IdUsuario")]
        public Usuario Usuario{ get; set; }

        public float ValorAtual{ get; set; }
        public float ValorLiquido { get; set; }
        public string NomeCarteira { get; set; }

        public float RiscoPorPosicao { get; set; }
        public float RiscoPorCarteira { get; set; }
        public float CustoOperacaoPadrao { get; set; }

        [Required]
        public ICollection<Posicao> Posicao{ get; set; }
    }
}