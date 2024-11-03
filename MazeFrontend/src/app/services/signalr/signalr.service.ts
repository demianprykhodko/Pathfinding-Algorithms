import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { MazeCell } from '../../models/maze-cell.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  public mazeUpdateSubject = new Subject<MazeCell[][]>();

  constructor() { 
    this.startConnection();
    this.addListeners();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7110/mazehub') // Adjust the URL to match your backend
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  private addListeners() {
    this.hubConnection.on('mazeUpdate', (mazeData: MazeCell[][]) => {
      this.mazeUpdateSubject.next(mazeData); // Emit the update to listeners
    });
  }

  public sendMazeUpdate(grid: MazeCell[][]) {
    console.log("send update", grid)
    this.hubConnection.invoke('MazeUpdate', grid)
      .catch(err => console.error('Error while sending maze update: ' + err));
  }
}
