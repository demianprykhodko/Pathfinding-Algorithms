using Microsoft.AspNetCore.SignalR;

namespace MazeBackend.Hubs
{
    public class MazeHub : Hub
    {
        public async Task MazeUpdate(object mazeData)
        {
            await Clients.Others.SendAsync("mazeUpdate", mazeData);
        }

    }
}
