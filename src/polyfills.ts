import 'zone.js';

// Add global to window
(window as any).global = window;

// Add Buffer
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;

// Add process
import process from 'process';
(window as any).process = process;

// Add stream
import streamBrowserify from 'stream-browserify';
(window as any).Stream = streamBrowserify;

// Add events
import EventEmitter from 'events';
(window as any).EventEmitter = EventEmitter; 