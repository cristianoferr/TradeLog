using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TradeLogServer.Models;

namespace TradeLogServer.Business
{
    public class BPUsuario : BaseBP<Usuario>
    {
        internal int AutenticaUsuario(out string saida, string email, string googleId,string name)
        {
            saida = "";
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
                SalvaDados();
            }

            saida = "{\"IdUsuario\": "+usuario.IdUsuario+"}";

            return usuario.IdUsuario;
        }

        private bool ExisteUsuarioComEmail(string email)
        {
            return db.Usuarios.Where(u => u.EmailUsuario == email).Any();
        }
    }
}