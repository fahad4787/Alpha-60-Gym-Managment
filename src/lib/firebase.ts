import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getRequiredEnv } from '@/lib/env'

let cachedApp: FirebaseApp | null = null

function getFirebaseConfig() {
  return {
    apiKey: getRequiredEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getRequiredEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getRequiredEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getRequiredEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getRequiredEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getRequiredEnv('VITE_FIREBASE_APP_ID'),
  }
}

export function getFirebaseApp() {
  cachedApp ??= initializeApp(getFirebaseConfig())
  return cachedApp
}

export function getAuthInstance() {
  return getAuth(getFirebaseApp())
}

export function getDb() {
  return getFirestore(getFirebaseApp())
}

