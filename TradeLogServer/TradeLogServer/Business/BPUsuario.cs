using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPUsuario : BaseBP<Usuario>
    {
        internal int AutenticaUsuario(out string saida, string email, string googleId,string name,string id_token)
        {
            saida = "";
            if (!ValidaTokenUsuario(email, id_token))
            {
                saida = "Invalid Token";
                return 0;
            }

            Usuario usuario = db.Usuarios.Where(u => u.EmailUsuario == email && u.GoogleId == googleId).FirstOrDefault();
            if (usuario == null)
            {
                //se existe então o googleid é diferente
                if (ExisteUsuarioComEmail(email))
                {
                    saida = "Invalid Login.";
                    return -1;
                }
                usuario = new Usuario();
                usuario.EmailUsuario = email;
                usuario.GoogleId = googleId;
                usuario.NomeUsuario = name;
                db.Usuarios.Add(usuario);
                CriaCarteiraInnicialParaUsuario(usuario);
                SalvaDados();
            } 
            saida = "{\"IdUsuario\": "+usuario.IdUsuario+"}";

            return usuario.IdUsuario;
        }

        private bool ValidaTokenUsuario(string email, string id_token)
        {
            string tokenUrl = String.Format("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={0}", id_token);

            try
            {
                JObject saida = Utils.Utils.LoadFromWeb(tokenUrl);
                return (saida["email_verified"].ToString() == "true" && saida["email"].ToString() == email);
            }
            catch (Exception e)
            {
                return false;
            }

        }

        private void CriaCarteiraInnicialParaUsuario(Usuario usuario)
        {
            Carteira carteira = new Carteira();
            carteira.Usuario = usuario;
            carteira.NomeCarteira = "Default";
            carteira.ValorLiquido = 0;
            carteira.RiscoPorCarteira = 6;
            carteira.RiscoPorPosicao = 2;
            carteira.CustoOperacaoPadrao = 20;
            carteira.CustoOperacaoRelativo = 0;
            db.Carteiras.Add(carteira);
        }

        private bool ExisteUsuarioComEmail(string email)
        {
            return db.Usuarios.Where(u => u.EmailUsuario == email).Any();
        }
    }
}