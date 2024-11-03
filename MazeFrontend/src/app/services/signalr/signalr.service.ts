import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private mazeUpdateSubject = new Subject<any>();

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
    this.hubConnection.on('ReceiveMaze', (mazeUpdate) => {
      this.mazeUpdateSubject.next(mazeUpdate);
    });
  }

  public sendMazeUpdate(mazeUpdate: string) {
    this.hubConnection.invoke('SendMaze', mazeUpdate)
      .catch(err => console.error(err));
  }

  public getMazeUpdates(): Observable<string> {
    return this.mazeUpdateSubject.asObservable();
  }
}
