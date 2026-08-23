import 'dotenv/config';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/nodejs';

const requiredEnvironment = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_API_TOKEN',
  'EMAILJS_SERVICE_ID',
  'EMAILJS_TEMPLATE_ID',
  'EMAILJS_PUBLIC_KEY',
  'CONTACT_RECIPIENT'
] as const;

for (const key of requiredEnvironment) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const port = Number(process.env['PORT'] ?? 3000);
const frontendOrigin = process.env['FRONTEND_ORIGIN'] ?? 'http://localhost:4200';
const adminApiToken = process.env['ADMIN_API_TOKEN'] as string;
const supabase = createClient(
  process.env['SUPABASE_URL'] as string,
  process.env['SUPABASE_SERVICE_ROLE_KEY'] as string
);

emailjs.init({ publicKey: process.env['EMAILJS_PUBLIC_KEY'] as string });

const app = express();
app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: '20kb' }));

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

function isContactPayload(value: unknown): value is ContactPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;
  return typeof payload['name'] === 'string'
    && payload['name'].trim().length > 0
    && payload['name'].length <= 100
    && typeof payload['email'] === 'string'
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload['email'])
    && payload['email'].length <= 100
    && typeof payload['message'] === 'string'
    && payload['message'].trim().length > 0
    && payload['message'].length <= 1000;
}

function isAdmin(request: Request): boolean {
  return request.header('x-admin-token') === adminApiToken;
}

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.post('/api/contacts', async (request: Request, response: Response) => {
  if (!isContactPayload(request.body)) {
    response.status(400).json({ error: 'Données de contact invalides.' });
    return;
  }

  const contact = {
    name: request.body.name.trim(),
    email: request.body.email.trim().toLowerCase(),
    message: request.body.message.trim()
  };

  const { data: savedMessage, error: insertError } = await supabase
    .from('contact_messages')
    .insert(contact)
    .select('id')
    .single();

  if (insertError || !savedMessage) {
    console.error('Contact insert error:', insertError);
    response.status(503).json({ error: 'Impossible d’enregistrer votre message.' });
    return;
  }

  try {
    await emailjs.send(
      process.env['EMAILJS_SERVICE_ID'] as string,
      process.env['EMAILJS_TEMPLATE_ID'] as string,
      {
        to_email: process.env['CONTACT_RECIPIENT'] as string,
        name: contact.name,
        email: contact.email,
        message: contact.message
      }
    );

    await supabase
      .from('contact_messages')
      .update({ status: 'sent', sent_at: new Date().toISOString(), error_message: null })
      .eq('id', savedMessage.id);

    response.status(201).json({ message: 'Message envoyé.' });
  } catch (error) {
    console.error('EmailJS send error:', error);
    await supabase
      .from('contact_messages')
      .update({ status: 'failed', error_message: 'EmailJS send failed' })
      .eq('id', savedMessage.id);

    response.status(502).json({ error: 'Message enregistré, mais son envoi a échoué.' });
  }
});

app.get('/api/contacts', async (request: Request, response: Response) => {
  if (!isAdmin(request)) {
    response.status(401).json({ error: 'Non autorisé.' });
    return;
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, message, status, created_at, sent_at, error_message')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Contact list error:', error);
    response.status(503).json({ error: 'Impossible de charger les messages.' });
    return;
  }

  response.json(data);
});

app.patch('/api/contacts/:id/status', async (request: Request, response: Response) => {
  if (!isAdmin(request)) {
    response.status(401).json({ error: 'Non autorisé.' });
    return;
  }

  const status = request.body?.status;
  if (!['pending', 'sent', 'failed'].includes(status)) {
    response.status(400).json({ error: 'Statut invalide.' });
    return;
  }

  const { error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', request.params['id']);

  if (error) {
    response.status(503).json({ error: 'Impossible de modifier le statut.' });
    return;
  }

  response.status(204).send();
});

app.listen(port, () => {
  console.log(`2MK API listening on port ${port}`);
});
