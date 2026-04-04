import { Injectable } from '@angular/core';

interface ResetToken {
  token: string;
  timestamp: number;
  email: string;
  used: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private readonly TOKEN_EXPIRY = 3600000; // 1 heure
  private readonly RATE_LIMIT = 300000; // 5 minutes
  private readonly STORAGE_KEY = 'dashboardResetToken';
  private readonly RATE_LIMIT_KEY = 'dashboardResetRateLimit';

  generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  createResetToken(email: string): string {
    // Vérifier le rate limiting
    const lastRequest = localStorage.getItem(this.RATE_LIMIT_KEY);
    if (lastRequest) {
      const timeSinceLastRequest = new Date().getTime() - parseInt(lastRequest);
      if (timeSinceLastRequest < this.RATE_LIMIT) {
        throw new Error(`Veuillez attendre ${Math.ceil((this.RATE_LIMIT - timeSinceLastRequest) / 1000)} secondes avant de faire une nouvelle demande.`);
      }
    }

    const token = this.generateToken();
    const resetData: ResetToken = {
      token,
      timestamp: new Date().getTime(),
      email,
      used: false
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetData));
    localStorage.setItem(this.RATE_LIMIT_KEY, new Date().getTime().toString());

    return token;
  }

  validateToken(token: string): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return false;

    const resetData: ResetToken = JSON.parse(stored);
    const now = new Date().getTime();

    // Vérifier token, expiration et utilisation
    if (resetData.token !== token) return false;
    if (resetData.used) return false;
    if (now - resetData.timestamp > this.TOKEN_EXPIRY) {
      localStorage.removeItem(this.STORAGE_KEY);
      return false;
    }

    return true;
  }

  markTokenAsUsed(token: string): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const resetData: ResetToken = JSON.parse(stored);
      if (resetData.token === token) {
        resetData.used = true;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetData));
      }
    }
  }

  getTokenEmail(token: string): string | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;

    const resetData: ResetToken = JSON.parse(stored);
    return resetData.token === token ? resetData.email : null;
  }

  clearResetData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
