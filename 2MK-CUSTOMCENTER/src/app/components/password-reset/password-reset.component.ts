import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent implements OnInit {
  resetForm!: FormGroup;
  token: string | null = null;
  isValidToken = false;
  isResetting = false;
  resetSuccess = false;
  errorMessage = '';

  private ADMIN_PASSWORD = environment.dashboardPassword;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private resetService: PasswordResetService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      
      if (this.token) {
        this.isValidToken = this.resetService.validateToken(this.token);
        if (!this.isValidToken) {
          this.errorMessage = 'Lien de réinitialisation invalide ou expiré.';
        }
      } else {
        this.errorMessage = 'Lien de réinitialisation manquant.';
      }
    });

    this.initResetForm();
  }

  initResetForm(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onResetSubmit(): void {
    if (!this.token || !this.isValidToken) {
      this.errorMessage = 'Token invalide. Veuillez demander un nouveau lien.';
      return;
    }

    if (this.resetForm.valid) {
      this.isResetting = true;
      const newPassword = this.resetForm.get('newPassword')?.value;

      try {
        // Mettre à jour le mot de passe dans l'environment
        environment.dashboardPassword = newPassword;
        
        // Sauvegarder le nouveau mot de passe en localStorage (pour la persistance)
        localStorage.setItem('dashboardPasswordHash', this.hashPassword(newPassword));
        
        // Marquer le token comme utilisé
        this.resetService.markTokenAsUsed(this.token);
        
        this.resetSuccess = true;
        this.resetForm.reset();

        // Redirection après 3 secondes
        setTimeout(() => {
          this.router.navigate(['/2mkdesk']);
        }, 3000);
      } catch (error) {
        this.errorMessage = 'Erreur lors de la réinitialisation. Veuillez réessayer.';
        this.isResetting = false;
      }
    }
  }

  private hashPassword(password: string): string {
    // Simple hash pour la validation
    return btoa(password);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
