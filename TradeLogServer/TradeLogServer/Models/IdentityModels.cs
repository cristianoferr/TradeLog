using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.Data.Entity;
using MySql.Data.Entity;

namespace TradeLogServer.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit https://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        private static readonly log4net.ILog _log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);


        public ApplicationDbContext()
            : base("Conexao", throwIfV1Schema: false)
        {
            Database.Log = log => _log.Debug(log);

        }
        
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public System.Data.Entity.DbSet<TradeLogServer.Models.Posicao> Posicoes { get; set; }

        public System.Data.Entity.DbSet<TradeLogServer.Models.Carteira> Carteiras { get; set; }

        public System.Data.Entity.DbSet<TradeLogServer.Models.Papel> Papels { get; set; }

        public System.Data.Entity.DbSet<TradeLogServer.Models.Movimento> Movimentoes { get; set; }

        public System.Data.Entity.DbSet<TradeLogServer.Models.Usuario> Usuarios { get; set; }

        public System.Data.Entity.DbSet<TradeLogServer.Models.Historico> Historicoes { get; set; }

        public System.Data.Entity.DbSet<TradeLogServer.Models.Trade> Trades { get; set; }

        public System.Data.Entity.DbSet<TradeLogServer.Models.Evolucao> Evolucaos { get; set; }
    }
}