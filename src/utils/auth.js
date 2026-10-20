import {

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  signOut,

  onAuthStateChanged,

  updateProfile,

} from 'firebase/auth'

import { auth,db } from '../Firebase'
import { ref, set, get } from 'firebase/database'

function userProfilePath(uid) {

  return `users/${uid}/profile`

} 
export async function saveUserProfile(uid, fields) {

  if (!db || !uid) return

  await set(ref(db, userProfilePath(uid)), fields)

}

export async function getUserProfile(uid) {

  if (!db || !uid) return null

  const snap = await get(ref(db, userProfilePath(uid)))

  return snap.exists() ? snap.val() : null

}
// Sign up a new user with email + password, and optionally a display name

export async function signUp(email, password, name, country) {
console.log (email,password,name,country)
  const cred = await createUserWithEmailAndPassword(auth, email, password)

  if (name) {

    await updateProfile(cred.user, { displayName: name })

  }
if (country) {

    await saveUserProfile(cred.user.uid, { country })

  }



  return cred.user

}
export async function logIn(email, password) {

  const cred = await signInWithEmailAndPassword(auth, email, password)

  return cred.user

}

 

// Log out the current user

export async function logOut() {

  await signOut(auth)

}

 

// Subscribe to auth state changes. Call the returned function to unsubscribe.

export function watchUser(callback) {

  return onAuthStateChanged(auth, (user) => {

    callback(user) // null when logged out, Firebase user object when logged in

  })

}

 

export function getCurrentUser() {

  return auth.currentUser

}
export function friendlyAuthError(err) {

  const code = err?.code || ''

  if (code.includes('email-already-in-use')) return 'That email is already registered. Try logging in instead.'

  if (code.includes('invalid-email')) return "That email address doesn't look right."

  if (code.includes('weak-password')) return 'Password should be at least 6 characters.'

  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential'))

    return 'Incorrect email or password.'

  return 'Something went wrong. Please try again.'

}
