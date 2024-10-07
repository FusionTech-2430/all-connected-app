const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const createUser = async (userData: FormData) => {
  try {
    const response = await fetch(API_URL + '/users-service/api/v1/users', {
      method: 'POST',
      body: userData,
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error inesperado en el servidor')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export const getUser = async (userId: string) => {
  try {
    const response = await fetch(
      API_URL + '/users-service/api/v1/users/' + userId,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error inesperado en el servidor')
    }
    return await response.json()
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}
