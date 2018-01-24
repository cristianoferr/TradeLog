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
        public Papel Papel { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        [ForeignKey("Carteira")]
        public int? IdCarteira { get; set; }
        public Carteira Carteira { get; set; }

        public ICollection<Trade> Trade { get; set; }

        public float PrecoMedioCompra { get; set; }
        public float PrecoMedioVenda { get; set; }

        public int QuantidadeComprada { get; set; }
        public int QuantidadeVendida { get; set; }

        [NotMapped]
        public int QuantidadeLiquida { get { return QuantidadeComprada - QuantidadeVendida; } }

        public float PrecoStopInicial { get; set; }
        public float PrecoStopAtual { get; set; }

        public DateTime DataEntrada { get; set; }
        public DateTime? DataSaida { get; set; }

        [NotMapped]
        public float PrecoAtual { get { return Papel.ValorAtual; } }
        [NotMapped]
        public float ValorSaldo { get { return CalcValor(PrecoAtual); } }
        [NotMapped]
        public float ValorMedioCompra { get { return CalcValor(PrecoMedioCompra); } }
        [NotMapped]
        public float ValorMedioVenda { get { return CalcValor(PrecoMedioVenda); } }
        [NotMapped]
        public string NomePapel { get { return Papel.Nome; } }
        [NotMapped]
        public string CodigoPapel { get { return Papel.Codigo; } }


        internal float CalcValor(float valor)
        {
            return valor * QuantidadeLiquida;
        }

        //Retorna a soma de todos os trades na ponta comprada
        [NotMapped]
        public float TotalComprado
        {
            get
            {
                return Trade.Where(x => x.QuantidadeComprada > 0).Sum(x => x.ValorTrade);
            }
        }

        //Retorna a soma de todos os trades na ponta vendida
        [NotMapped]
        public float TotalVendido
        {
            get
            {
                return Trade.Where(x => x.QuantidadeVendida > 0).Sum(x => x.ValorTrade);
            }
        }


        //Retorna o valorNaCarteira + totalVendido
        [NotMapped]
        public float ValorPosicaoAtual
        {
            get
            {
                return ValorSaldo + TotalVendido;
            }
        }

        //Retorna o valorNaCarteira + totalVendido
        [NotMapped]
        public float DiferencaAtual
        {
            get
            {
                return ValorPosicaoAtual - TotalComprado;
            }
        }



        //Novas Propriedades
            [NotMapped]
        public float RiscoPosicao
        {
            get
            {
                float valorCompra = QuantidadeLiquida*PrecoMedioCompra;
                float totalStop = QuantidadeLiquida * PrecoStopAtual;
                float dif = valorCompra - totalStop;
                if (dif < 0) dif = 0;
                return dif;
            }
        }
    }
}