using Microsoft.AspNetCore.SignalR;

namespace MazeBackend.Hubs
{
    public class MazeHub : Hub
    {
        public async Task MazeUpdate(object mazeData)
        {
            await Clients.Others.SendAsync("mazeUpdate", mazeData);
        }

        public async Task IsGeneratingUpdate(bool isGeneratingData)
        {
            await Clients.Others.SendAsync("isGeneratingUpdate", isGeneratingData);
        }

        public async Task SetStartCell(object startCell)
        {
            await Clients.Others.SendAsync("receiveStartCell", startCell);
        }

        public async Task SetEndCell(object endCell)
        {
            await Clients.Others.SendAsync("receiveEndCell", endCell);
        }
    }
}
