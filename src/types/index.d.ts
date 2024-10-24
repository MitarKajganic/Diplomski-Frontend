export interface LoginResponse {
    token: string;
  }
  
  export interface User {
    email: string;
    role: string;
  }
  
  export interface ApiError {
    status: number;
    message: string;
    errors: string[];
  }
  
  export interface Order {
    id: string;
    description: string;
    status: string;
    // Add other order properties as needed
  }
  
  // Add more interfaces as required
  