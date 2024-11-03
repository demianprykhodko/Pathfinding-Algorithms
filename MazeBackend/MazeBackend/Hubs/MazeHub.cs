using Microsoft.AspNetCore.SignalR;

namespace MazeBackend.Hubs
{
    public class MazeHub : Hub
    {
        public async Task SendMaze(string maze)
        {
            await Clients.All.SendAsync("ReceiveMaze", maze);
        }
    }
}
