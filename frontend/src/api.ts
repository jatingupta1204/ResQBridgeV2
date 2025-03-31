export const API_BASE_URL = "http://127.0.0.1:5000";

// 🟢 Auth API
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "register", ...data }),
  });
  return response.json();
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", ...data }),
  });
  return response.json();
}

// 🟠 Incident API
export async function createIncident(data: {
  title: string;
  location: string;
  reportedAt?: string;
  status?: string;
  description?: string;
  contact?: string;
  emergencyType?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function getIncidents(token?: string) {
  // Optionally add authentication if token is provided
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE_URL}/api/incidents`, { headers });
  return response.json();
}

export const updateIncident = async (
  id: number,
  updatedData: { title?: string; description?: string; location?: string; contact?: string; status?: string }
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/incidents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`Error updating incident: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Update incident error:", error);
    throw error;
  }
};

export async function deleteIncident(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/incidents/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function resolveSOS(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/sos/${id}/resolve`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

// 🟡 Users API (formerly volunteer API)
export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/api/users`);
  return response.json();
}

export async function updateUser(id: number, data: { name: string; email: string; role?: string }) {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteUser(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

/**
 * Creates a new user.
 * @param data An object containing name, email, role, and password.
 * @param token (Optional) JWT token if authentication is required.
 */
export const createUser = async (userData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",  // Ensure it's POST
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // If authentication is required
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};

// 🔵 Image Analysis API
export async function analyzeImage(imageData: string) {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageData }),
  });
  return response.json();
}

// 🟣 SOS API
export async function getSOSReports(token?: string) {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  const response = await fetch(`${API_BASE_URL}/api/sos/`, { headers });
  return response.json();
}

export async function sendSOS(data: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/sos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export const updateSOSReport = async (id: number, updatedData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/sos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  return response.json();
};

export const deleteSOSReport = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/sos/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  return response.json();
};
