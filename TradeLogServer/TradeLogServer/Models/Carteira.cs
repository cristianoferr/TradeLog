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

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario{ get; set; }

        public float ValorLiquido { get; set; }
        public string NomeCarteira { get; set; }

        public float RiscoPorPosicao { get; set; }
        public float RiscoPorCarteira { get; set; }
        public float CustoOperacaoPadrao { get; set; }

        public ICollection<Posicao> Posicao{ get; set; }

        [NotMapped]
        public float ValorAtual
        {
            get
            {
                return Posicao.Sum(x => x.ValorPosicaoAtual) +ValorLiquido;
            }
        }

    }
}