import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'admin' | 'user';

export interface UserSession {
  username: string;
  role: UserRole;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'DAM2_AUTH_SESSION';

  // Signal reactivo para el estado en memoria
  private _currentUser = signal<UserSession | null>(this.readSessionFromStorage());

  // Selectores computados públicos de solo lectura
  public currentUser = this._currentUser.asReadonly();
  public isAuthenticated = computed(() => this._currentUser()?.isAuthenticated ?? false);
  public userRole = computed(() => this._currentUser()?.role ?? null);

  /**
   * Valida credenciales requeridas:
   * - admin / 123 -> Rol: 'admin'
   * - operador / 123 -> Rol: 'user'
   */
  public login(user: string, pass: string): boolean {
    let sessionData: UserSession | null = null;

    if (user === 'admin' && pass === '123') {
      sessionData = {
        username: user,
        role: 'admin',
        isAuthenticated: true
      };
    } else if (user === 'operador' && pass === '123') {
      sessionData = {
        username: user,
        role: 'user',
        isAuthenticated: true
      };
    }

    if (sessionData) {
      this._currentUser.set(sessionData);
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      return true;
    }

    return false;
  }

  public logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this._currentUser.set(null);
  }

  private readSessionFromStorage(): UserSession | null {
    const rawData = sessionStorage.getItem(this.STORAGE_KEY);
    if (!rawData) {
      return null;
    }
    try {
      return JSON.parse(rawData) as UserSession;
    } catch {
      sessionStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }
}