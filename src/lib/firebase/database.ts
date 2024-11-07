// create utility functions for Firestore

import { database } from '@/lib/firebase/config'

import { get, ref, set, push, remove } from 'firebase/database'

// Define the type of data that will be stored in Firestore
interface FooBar {
  foo: string
  bar: number
}

export const getDoc = async (path: string) => {
  try {
    const docRef = ref(database, path)
    const docSnapshot = await get(docRef)
    return docSnapshot.val()
  } catch (error) {
    console.error('Error getting document: ', error)
    throw error
  }
}

export const setDoc = async (path: string, data: FooBar) => {
  try {
    const docRef = ref(database, path)
    await set(docRef, data)
  } catch (error) {
    console.error('Error setting document: ', error)
    throw error
  }
}

export const addDoc = async (path: string, data: FooBar) => {
  try {
    const docRef = ref(database, path)
    await push(docRef, data)
  } catch (error) {
    console.error('Error adding document: ', error)
    throw error
  }
}

export const deleteDoc = async (path: string) => {
  try {
    const docRef = ref(database, path)
    await remove(docRef)
  } catch (error) {
    console.error('Error deleting document: ', error)
    throw error
  }
}
