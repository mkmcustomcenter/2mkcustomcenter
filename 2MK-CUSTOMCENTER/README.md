# 2MKCUSTOMCENTER

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


# Contact Form – Angular + EmailJS Project

This standalone Angular project features a modal contact form that sends an email using EmailJS, with no backend required.

---

## ✨ Features

- Contact form displayed in a modal window
- Email sending via [EmailJS](https://www.emailjs.com/)
- Error handling and success message
- API keys secured using an untracked environment file

---

## 🚀 Installation

```bash
npm install
```

---

## 🔧 Configuration

1. Create an account on [emailjs.com](https://www.emailjs.com/).
2. Set up a service, a template, and get your public key.
3. Copy the example environment file:

4. Open `src/environments/environment.ts` and replace the placeholder values:

```ts
export const environment = {
  production: false,
  emailJsServiceId: 'YOUR_SERVICE_ID',
  emailJsTemplateId: 'YOUR_TEMPLATE_ID',
  emailJsPublicKey: 'YOUR_PUBLIC_KEY'
};
```

---

## 🧪 Run the App

```bash
ng serve
```

Go to `http://localhost:4200`.

---

## 🔐 Security

- `environment.ts` and `environment.prod.ts` are excluded from Git.
- Use the `environment.ts` file as a template.
- Never publish your real keys in a public repository.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── contact-modal/      ← Contact form component
│   └── ...
├── environments/
│   ├── environment.ts          ← (Git-ignored)
└── └── environment.prod.ts     ← (Git-ignored)
```

---

## 🛡️ Recommendations

- For extra security, consider adding reCAPTCHA (human verification).
- For a more secure and scalable setup, create a backend (Node.js, Python...) to handle the email sending logic.

---

## 📝 License

Personal / educational project – Free to reuse with attribution.
