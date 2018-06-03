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
        [Key]
        public int IdBalanco { get; set; }

        [ForeignKey("Carteira")]
        public int IdCarteira { get; set; }
        public Carteira Carteira { get; set; }

        [ForeignKey("Papel")]
        public int IdPapel { get; set; }
        public Papel Papel { get; set; }

        public float PesoPapel { get; set; }
        public string FlagCongelado { get; set; }


        [NotMapped]
        public bool BoolCongelado
        {
            get
            {
                return FlagCongelado == "T";
            }
            set
            {
                FlagCongelado = value ? "T" : "F";
            }
        }

        [NotMapped]
        public float QtdPosse
        {
            get
            {
                int qtd = Carteira.Posicao.Where(pos => pos.Papel.Codigo == Papel.Codigo).Sum(x => x.QuantidadeLiquida);
                return qtd;
            }
        }


        [NotMapped]
        public string CodigoPapel
        {
            get
            {
                return Papel.Codigo;
            }
        }

        [NotMapped]
        public float ValorPapel
        {
            get
            {
                return Papel.ValorAtual;
            }
        }

        [NotMapped]
        public float ValorAtual
        {
            get
            {
                return Carteira.ValorAtual;
            }
        }

    }
}