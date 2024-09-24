const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// services/userService.ts
export const createUser = async (userData: FormData) => {
  try {
    const response = await fetch(API_URL+"/users", {
      method: 'POST',
      body: userData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); // Extraemos el cuerpo del error
      throw new Error(errorData.message || 'Error inesperado en el servidor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


