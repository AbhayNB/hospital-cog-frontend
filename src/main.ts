import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Import zone.js for the application
import 'zone.js';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
