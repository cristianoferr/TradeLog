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
        public int LotePadrao{ get; set; }
        public DateTime LastUpdate { get; set; }
        public string LastUpdateMessage { get; set; }

        public ICollection<Posicao> Posicao { get; set; }

        [NotMapped]
        public ICollection<Posicao> PosicaoAtiva { get
            {
                if (Posicao == null) return null;
                return Posicao.Where(x => x.FlagAtivo == "T").ToList();
            }
        }

        [NotMapped]
        public int PosicaoCount
        {
            get { if (Posicao == null) return 0;
                return Posicao.Count;
            }
        }


    }
}