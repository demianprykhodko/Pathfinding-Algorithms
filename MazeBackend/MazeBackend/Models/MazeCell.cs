namespace MazeBackend.Models
{
    public class MazeCell
    {
        public int Id { get; set; } // Unique identifier for the cell
        public int X { get; set; }
        public int Y { get; set; }
        public bool IsWall { get; set; }
        public bool IsStart { get; set; }
        public bool IsEnd { get; set; }
        public bool IsPath { get; set; }
        public bool IsVisited { get; set; }
    }
}
