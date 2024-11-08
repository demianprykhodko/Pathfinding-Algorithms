using MazeBackend.Data;
using MazeBackend.Models;
using MazeBackend.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace MazeBackend.Tests.Services
{
    public class MazeServiceTests
    {
        private readonly MazeService _mazeService;
        private readonly MazeDbContext _context;

        public MazeServiceTests()
        {
            // Set up the in-memory database options
            var options = new DbContextOptionsBuilder<MazeDbContext>()
                .UseInMemoryDatabase(databaseName: "TestMazeDatabase")
                .Options;

            // Create a new instance of the in-memory database context
            _context = new MazeDbContext(options);

            // Initialize the MazeService with the in-memory context
            _mazeService = new MazeService(_context);
        }

        [Fact]
        public async Task UpdateCellsAsync_ShouldUpdateExistingCells()
        {
            // Arrange
            var existingCell = new MazeCell { X = 0, Y = 0, IsWall = false };
            _context.MazeCells.Add(existingCell);
            await _context.SaveChangesAsync();

            var updatedCell = new MazeCell { X = 0, Y = 0, IsWall = true };

            // Act
            await _mazeService.UpdateCellsAsync(new List<MazeCell> { updatedCell });

            // Assert
            var dbCell = await _context.MazeCells.FirstOrDefaultAsync(c => c.X == 0 && c.Y == 0);
            Assert.NotNull(dbCell);
            Assert.True(dbCell.IsWall); // Check if the wall property was updated
        }

        [Fact]
        public async Task UpdateCellsAsync_ShouldAddNewCellIfNotExists()
        {
            // Arrange
            var newCell = new MazeCell { X = 1, Y = 1, IsWall = true };

            // Act
            await _mazeService.UpdateCellsAsync(new List<MazeCell> { newCell });

            // Assert
            var dbCell = await _context.MazeCells.FirstOrDefaultAsync(c => c.X == 1 && c.Y == 1);
            Assert.NotNull(dbCell);
            Assert.True(dbCell.IsWall); // Check if the new cell was added
        }

        [Fact]
        public async Task GetFlatGridAsync_ShouldReturnAllCells()
        {
            // Arrange
            _context.MazeCells.AddRange(
                new MazeCell { X = 0, Y = 0, IsWall = false },
                new MazeCell { X = 1, Y = 1, IsWall = true }
            );
            await _context.SaveChangesAsync();

            // Act
            var result = await _mazeService.GetFlatGridAsync();

            // Assert
            Assert.Equal(2, result.Count);
        }
    }
}