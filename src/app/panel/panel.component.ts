import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { defer, finalize, interval, Subscription, timeout, TimeoutError } from 'rxjs';

import { Evento } from '../models/evento.model';
import { ResumenEvento } from '../models/resumen-evento.model';
import { EventpassService } from '../services/eventpass.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css',
})
export class PanelComponent implements OnInit, OnDestroy {
  private readonly servicio = inject(EventpassService);
  private readonly errorEventos = signal<string | null>(null);
  private readonly errorResumen = signal<string | null>(null);
  private readonly tiempoLimiteConsultaMs = 8_000;

  readonly eventos = signal<Evento[]>([]);
  readonly eventoSeleccionadoId = signal<number | null>(null);
  readonly resumen = signal<ResumenEvento | null>(null);
  readonly cargandoEventos = signal(false);
  readonly cargando = signal(false);
  readonly mensajeError = computed(() => this.errorEventos() ?? this.errorResumen());
  readonly ultimaActualizacion = signal<Date | null>(null);

  private temporizador?: Subscription;
  private consultaEventos?: Subscription;
  private consultaResumen?: Subscription;
  private versionSeleccion = 0;
  private destruido = false;

  ngOnInit(): void {
    this.cargarEventos();
    this.temporizador = interval(10_000).subscribe(() => this.actualizarResumen());
  }

  cargarEventos(): void {
    if (this.destruido) {
      return;
    }

    this.consultaEventos?.unsubscribe();
    this.cargandoEventos.set(true);

    this.consultaEventos = defer(() => this.servicio.obtenerEventos())
      .pipe(
        timeout(this.tiempoLimiteConsultaMs),
        finalize(() => this.cargandoEventos.set(false)),
      )
      .subscribe({
        next: (eventos) => {
          this.eventos.set(eventos);
          this.errorEventos.set(null);

          const id = this.eventoSeleccionadoId();
          if (id !== null && !eventos.some((evento) => evento.id === id)) {
            this.seleccionarEvento(null);
          }
        },
        error: (error: unknown) => {
          this.errorEventos.set(this.crearMensajeError(error, false));
        },
      });
  }

  seleccionarEvento(id: number | null): void {
    if (this.destruido || id === this.eventoSeleccionadoId()) {
      return;
    }

    this.versionSeleccion += 1;
    this.consultaResumen?.unsubscribe();
    this.consultaResumen = undefined;

    this.eventoSeleccionadoId.set(id);
    this.cargando.set(false);
    this.resumen.set(null);
    this.ultimaActualizacion.set(null);
    this.errorResumen.set(null);

    this.actualizarResumen();
  }

  actualizarResumen(): void {
    const id = this.eventoSeleccionadoId();

    if (this.destruido || id === null || this.cargando()) {
      return;
    }

    const version = this.versionSeleccion;
    this.cargando.set(true);

    this.consultaResumen = defer(() => this.servicio.obtenerResumen(id))
      .pipe(
        timeout(this.tiempoLimiteConsultaMs),
        finalize(() => {
          if (this.esSeleccionActual(id, version)) {
            this.cargando.set(false);
          }
        }),
      )
      .subscribe({
        next: (resumen) => {
          if (!this.esSeleccionActual(id, version)) {
            return;
          }

          if (resumen?.evento_id !== id) {
            this.errorResumen.set('La información recibida no corresponde al evento seleccionado.');
            return;
          }

          this.resumen.set(resumen);
          this.ultimaActualizacion.set(new Date());
          this.errorResumen.set(null);
        },
        error: (error: unknown) => {
          if (this.esSeleccionActual(id, version)) {
            this.errorResumen.set(this.crearMensajeError(error, true));
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destruido = true;
    this.versionSeleccion += 1;
    this.temporizador?.unsubscribe();
    this.consultaEventos?.unsubscribe();
    this.consultaResumen?.unsubscribe();
    this.cargandoEventos.set(false);
    this.cargando.set(false);
  }

  private esSeleccionActual(id: number, version: number): boolean {
    return (
      !this.destruido && id === this.eventoSeleccionadoId() && version === this.versionSeleccion
    );
  }

  private crearMensajeError(error: unknown, esResumen: boolean): string {
    if (error instanceof TimeoutError) {
      return 'El servidor tardó demasiado en responder. Intenta nuevamente.';
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'No se pudo conectar con el servidor. Intenta nuevamente.';
      }

      if (error.status === 404 && esResumen) {
        return 'El evento seleccionado no existe o ya no está disponible.';
      }
    }

    return esResumen
      ? 'No se pudo actualizar la información del evento. Intenta nuevamente.'
      : 'No se pudieron cargar los eventos. Intenta nuevamente.';
  }
}
