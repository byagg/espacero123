export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone?: string
  password: string
}

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (data: RegisterData) => Promise<void>
}
