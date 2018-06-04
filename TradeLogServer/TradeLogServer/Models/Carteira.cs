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

        public int LoteFill{ get; set; }
        public float RiscoPorPosicao { get; set; }
        public float RiscoPorCarteira { get; set; }
        public float CustoOperacaoPadrao { get; set; }
        public float CustoOperacaoRelativo { get; set; }
        public float TotalMovimentado { get; set; }
        

        public ICollection<Posicao> Posicao{ get; set; }
        [NotMapped]
        public ICollection<Posicao> PosicaoAtiva
        {
            get {
                if (Posicao == null) return null;
                return Posicao.Where(x => x.FlagAtivo == "T").ToList(); }
        }

        [NotMapped]
        public ICollection<Posicao> PosicaoFechada
        {
            get
            {
                if (Posicao == null) return null;
                return Posicao.Where(x => x.FlagAtivo == "F").ToList();
            }
        }


        [NotMapped]
        public float ValorAtual
        {
            get
            {
                if (Posicao == null) return 0;
                return PosicaoAtiva.Sum(x => x.ValorSaldo) +ValorLiquido;
            }
        }

        //Propriedades novas


            /*Retorna o valor que eu tenho hoje (para cada posição, retorna o saldo de acoes (compra-venda) * Valor Atual)*/
        [NotMapped]
        public float ValorSaldoAtual
        {
            get
            {
                if (Posicao == null) return 0;
                return PosicaoAtiva.Sum(x => x.ValorSaldo) ;
            }
        }

        /*Retorna a soma do valor médio compra de todas as posições*/
        [NotMapped]
        public float ValorMedioCompra
        {
            get
            {
                if (Posicao == null) return 0;
                return PosicaoAtiva.Sum(x => x.ValorMedioCompra);
            }
        }

        /*Retorna a soma do valor médio venda de todas as posições*/
        [NotMapped]
        public float ValorMedioVenda
        {
            get
            {
                if (PosicaoAtiva == null) return 0;
                return PosicaoAtiva.Sum(x => x.ValorMedioVenda);
            }
        }

        /*Retorna o valor total que está sob risco nas posições*/
        [NotMapped]
        public float ValorRiscoPosicoes
        {
            get
            {
                if (Posicao == null) return 0;
                return PosicaoAtiva.Sum(x => x.RiscoPosicao);
            }
        }

        /*retorna o valor máximo que pode ser arriscado na carteira, levando em conta o valor médio de compra*/
        [NotMapped]
        public float ValorRiscoMaximoCarteira
        {
            get
            {
                float valorCarteiraComprado = ValorMedioCompra + ValorLiquido;
                float risco = RiscoPorCarteira * valorCarteiraComprado/100;
                return risco;
            }
        }

        /*retorna o valor risco descontado do que já foi arriscado*/
        [NotMapped]
        public float SaldoRiscoCarteira
        {
            get
            {
                float saldo = ValorRiscoMaximoCarteira- ValorRiscoPosicoes;
                if (saldo < 0) saldo = 0;
                return saldo;
            }
        }

        /* Retorna o percentual de risco que está sendo arriscado atualmente */
        [NotMapped]
        public float PercRiscoAtual
        {
            get
            {
                float saldo = ValorRiscoPosicoes/(ValorMedioCompra + ValorLiquido);
                return saldo*100;
            }
        }

        /*Quantidade máxima que o trade pode perder de acordo com a situação atual*/ 
        [NotMapped]
        public float PerdaMaximaTrade
        {
            get
            {
                float saldo = RiscoPorPosicao* ValorAtual/100;
                return saldo;
            }
        }


        [NotMapped]
        public float RiscoAtual
        {
            get
            {
                return PercRiscoAtual / 100f* (ValorMedioCompra + ValorLiquido);
            }
        }


    }
}