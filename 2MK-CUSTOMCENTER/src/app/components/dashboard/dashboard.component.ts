import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PasswordResetService } from '../../services/password-reset.service';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  galerieForm!: FormGroup;
  evenementForm!: FormGroup;
  loginForm!: FormGroup;
  changePasswordForm!: FormGroup;
  
  galerieImages: any[] = [];
  evenements: any[] = [];
  
  galerieSubmitted = false;
  evenementSubmitted = false;
  isAuthenticated = false;
  loginAttempt = 0;
  maxAttempts = 3;
  isLocked = false;
  lockTime = 5 * 60 * 1000; // 5 minutes
  
  // Password reset
  showPasswordSection = false;
  isChangingPassword = false;
  passwordChangeMessage = '';
  isRequestingReset = false;
  resetRequestMessage = '';
  
  private ADMIN_PASSWORD = environment.dashboardPassword;

  constructor(
    private fb: FormBuilder,
    private resetService: PasswordResetService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.initGalerieForm();
    this.initEvenementForm();
    this.initChangePasswordForm();
    this.checkAuthentication();
    this.loadGalerie();
    this.loadEvenements();
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  initChangePasswordForm(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(4)]],
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

  checkAuthentication(): void {
    const session = localStorage.getItem('dashboardSession');
    if (session) {
      const parsedSession = JSON.parse(session);
      const now = new Date().getTime();
      if (now - parsedSession.timestamp < 3600000) {
        this.isAuthenticated = true;
      } else {
        localStorage.removeItem('dashboardSession');
      }
    }

    const lockStatus = localStorage.getItem('dashboardLock');
    if (lockStatus) {
      const parsedLock = JSON.parse(lockStatus);
      const now = new Date().getTime();
      if (now - parsedLock.timestamp < this.lockTime) {
        this.isLocked = true;
      } else {
        localStorage.removeItem('dashboardLock');
        localStorage.removeItem('dashboardAttempts');
        this.isLocked = false;
        this.loginAttempt = 0;
      }
    }

    const attempts = localStorage.getItem('dashboardAttempts');
    if (attempts) {
      this.loginAttempt = parseInt(attempts);
    }
  }

  onLoginSubmit(): void {
    if (this.isLocked) {
      alert('Compte verrouillé. Veuillez réessayer plus tard.');
      return;
    }

    if (this.loginForm.valid) {
      const enteredPassword = this.loginForm.get('password')?.value;
      
      if (enteredPassword === this.ADMIN_PASSWORD) {
        this.isAuthenticated = true;
        const session = {
          timestamp: new Date().getTime(),
          authenticated: true
        };
        localStorage.setItem('dashboardSession', JSON.stringify(session));
        localStorage.removeItem('dashboardAttempts');
        this.loginAttempt = 0;
        this.loginForm.reset();
      } else {
        this.loginAttempt++;
        localStorage.setItem('dashboardAttempts', this.loginAttempt.toString());
        
        if (this.loginAttempt >= this.maxAttempts) {
          this.isLocked = true;
          const lockStatus = {
            timestamp: new Date().getTime(),
            locked: true
          };
          localStorage.setItem('dashboardLock', JSON.stringify(lockStatus));
          alert('Trop de tentatives. Le compte est verrouillé pendant 5 minutes.');
        } else {
          const remaining = this.maxAttempts - this.loginAttempt;
          alert(`Mot de passe incorrect. ${remaining} tentative(s) restante(s).`);
        }
        this.loginForm.reset();
      }
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('dashboardSession');
    this.loginForm.reset();
    this.showPasswordSection = false;
    this.changePasswordForm.reset();
  }

  onLogout(): void {
    this.logout();
  }

  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    this.passwordChangeMessage = '';
    if (this.showPasswordSection) {
      this.changePasswordForm.reset();
    }
  }

  onChangePassword(): void {
    if (this.changePasswordForm.valid) {
      const currentPassword = this.changePasswordForm.get('currentPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;

      if (currentPassword !== this.ADMIN_PASSWORD) {
        this.passwordChangeMessage = '❌ Le mot de passe actuel est incorrect.';
        return;
      }

      if (currentPassword === newPassword) {
        this.passwordChangeMessage = '⚠️ Le nouveau mot de passe doit être différent du mot de passe actuel.';
        return;
      }

      try {
        this.isChangingPassword = true;
        // Mettre à jour le mot de passe
        this.ADMIN_PASSWORD = newPassword;
        environment.dashboardPassword = newPassword;
        
        // Sauvegarder en localStorage
        localStorage.setItem('dashboardPasswordHash', btoa(newPassword));
        
        this.passwordChangeMessage = '✅ Mot de passe changé avec succès!';
        this.changePasswordForm.reset();
        
        setTimeout(() => {
          this.showPasswordSection = false;
          this.passwordChangeMessage = '';
        }, 2000);
      } catch (error) {
        this.passwordChangeMessage = '❌ Erreur lors du changement de mot de passe.';
      } finally {
        this.isChangingPassword = false;
      }
    }
  }

  async onRequestPasswordReset(): Promise<void> {
    try {
      this.isRequestingReset = true;
      this.resetRequestMessage = '';

      // Générer un token de réinitialisation
      const token = this.resetService.createResetToken(environment.adminEmail);

      // Créer le lien de réinitialisation
      const resetLink = `${window.location.origin}/2mkreset?token=${token}`;

      // Envoyer l'email avec EmailJS
      await emailjs.send(
        environment.emailJsServiceId,
        environment.emailJsTemplateId,
        {
          to_email: environment.adminEmail,
          subject: 'Réinitialisation du mot de passe - 2MK Custom Center',
          message: `Vous avez demandé une réinitialisation du mot de passe.\n\nClic sur le lien ci-dessous pour réinitialiser votre mot de passe:\n\n${resetLink}\n\nCe lien expire dans 1 heure.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`
        },
        environment.emailJsPublicKey
      );

      this.resetRequestMessage = '✅ Un email de réinitialisation a été envoyé à ' + environment.adminEmail;
      
      setTimeout(() => {
        this.resetRequestMessage = '';
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du reset:', error);
      this.resetRequestMessage = '❌ Erreur lors de l\'envoi de l\'email. Veuillez réessayer.';
    } finally {
      this.isRequestingReset = false;
    }
  }

  async onRequestPasswordResetFromLogin(): Promise<void> {
    try {
      this.isRequestingReset = true;
      this.resetRequestMessage = '';

      // Générer un token de réinitialisation
      const token = this.resetService.createResetToken(environment.adminEmail);

      // Créer le lien de réinitialisation
      const resetLink = `${window.location.origin}/2mkreset?token=${token}`;

      // Envoyer l'email avec EmailJS à l'adresse admin
      await emailjs.send(
        environment.emailJsServiceId,
        environment.emailJsTemplateId,
        {
          to_email: environment.adminEmail,
          subject: 'Réinitialisation du mot de passe - 2MK Custom Center',
          message: `Vous avez demandé une réinitialisation du mot de passe.\n\nCliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:\n\n${resetLink}\n\nCe lien expire dans 1 heure.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`
        },
        environment.emailJsPublicKey
      );

      this.resetRequestMessage = '✅ Email de réinitialisation envoyé! Vérifiez votre messagerie.';
      
      setTimeout(() => {
        this.resetRequestMessage = '';
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du reset:', error);
      this.resetRequestMessage = '❌ Erreur lors de l\'envoi. Veuillez réessayer.';
    } finally {
      this.isRequestingReset = false;
    }
  }

  initGalerieForm(): void {
    this.galerieForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      categorie: ['', Validators.required]
    });
  }

  initEvenementForm(): void {
    this.evenementForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      date: ['', Validators.required],
      lieu: ['', Validators.required],
      imageUrl: ['']
    });
  }

  onGalerieSubmit(): void {
    this.galerieSubmitted = true;
    if (this.galerieForm.valid) {
      const newImage = this.galerieForm.value;
      this.galerieImages.push({ ...newImage, id: Date.now() });
      this.saveGalerie();
      this.galerieForm.reset();
      this.galerieSubmitted = false;
      alert('Image ajoutée avec succès!');
    }
  }

  onEvenementSubmit(): void {
    this.evenementSubmitted = true;
    if (this.evenementForm.valid) {
      const newEvent = this.evenementForm.value;
      this.evenements.push({ ...newEvent, id: Date.now() });
      this.saveEvenements();
      this.evenementForm.reset();
      this.evenementSubmitted = false;
      alert('Événement ajouté avec succès!');
    }
  }

  deleteImage(id: number): void {
    this.galerieImages = this.galerieImages.filter(img => img.id !== id);
    this.saveGalerie();
  }

  deleteEvenement(id: number): void {
    this.evenements = this.evenements.filter(evt => evt.id !== id);
    this.saveEvenements();
  }

  saveGalerie(): void {
    localStorage.setItem('galerieImages', JSON.stringify(this.galerieImages));
  }

  loadGalerie(): void {
    const data = localStorage.getItem('galerieImages');
    this.galerieImages = data ? JSON.parse(data) : [];
  }

  saveEvenements(): void {
    localStorage.setItem('evenements', JSON.stringify(this.evenements));
  }

  loadEvenements(): void {
    const data = localStorage.getItem('evenements');
    this.evenements = data ? JSON.parse(data) : [];
  }
}
