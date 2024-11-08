using MazeBackend.Data;
using MazeBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace MazeBackend.Services
{
    public class MazeService {
        private readonly MazeDbContext _context;

        public MazeService(MazeDbContext context)
        {
            _context = context;
        }

        // Update specific cells in the grid
        public async Task UpdateCellsAsync(List<MazeCell> updatedCells)
        {
            foreach (var cell in updatedCells)
            {
                var dbCell = await _context.MazeCells.FirstOrDefaultAsync(c => c.X == cell.X && c.Y == cell.Y);
                if (dbCell != null)
                {
                    // Update existing cell
                    dbCell.IsWall = cell.IsWall;
                    dbCell.IsStart = cell.IsStart;
                    dbCell.IsEnd = cell.IsEnd;
                    dbCell.IsPath = cell.IsPath;
                    dbCell.IsVisited = cell.IsVisited;
                }
                else
                {
                    // Add new cell if it doesn’t already exist
                    await _context.MazeCells.AddAsync(cell);
                }
            }
            await _context.SaveChangesAsync();
        }

        // Retrieve the current grid as List<List<MazeCell>> structure
        public async Task<List<MazeCell>> GetFlatGridAsync()
        {
            return await _context.MazeCells.ToListAsync();
        }
    }
}
