using MazeBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace MazeBackend.Data
{
    public class MazeDbContext : DbContext
    {
        public MazeDbContext(DbContextOptions<MazeDbContext> options) : base(options) { }

        public DbSet<MazeCell> MazeCells { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MazeCell>().HasKey(m => m.Id);
        }
    }
}
