import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Evento } from '../models/evento.model';
import { ResumenEvento } from '../models/resumen-evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventpassService {
  private http = inject(HttpClient);
  private baseUrl = environment.gatewayUrl;

  /**
   * Obtiene la lista completa de eventos para llenar el selector.
   * Endpoint: GET /api/eventos
   */
  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/api/eventos`);
  }

  /**
   * Obtiene las métricas de aforo de un evento específico por su ID.
   * Endpoint: GET /api/entradas/eventos/{id}/resumen
   */
  obtenerResumen(id: number): Observable<ResumenEvento> {
    return this.http.get<ResumenEvento>(`${this.baseUrl}/api/entradas/eventos/${id}/resumen`);
  }
}