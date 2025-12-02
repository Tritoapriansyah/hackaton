/**
 * Enhanced password security service with validation and history
 */
export class PasswordSecurityService {
  /**
   * Common weak passwords that should be rejected
   */
  private static readonly WEAK_PASSWORDS = [
    'password123',
    '123456789',
    'qwerty123',
    'admin123',
    'password1',
    'letmein123',
    'welcome123',
    'monkey123',
    '123456',
    '1234567890',
    'qwerty',
    'abc123',
    '111111',
    'password',
    'iloveyou',
    'princess',
    'password12',
  ]

  /**
   * Check if password meets security requirements
   */
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!password || password.length < 12) {
      errors.push('Password must be at least 12 characters long')
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)')
    }

    // Check against common weak passwords
    const normalizedPassword = password.toLowerCase()
    for (const weakPassword of PasswordSecurityService.WEAK_PASSWORDS) {
      if (normalizedPassword.includes(weakPassword)) {
        errors.push('Password contains common words and phrases that are not allowed')
        break
      }
    }

    // Check for sequential characters
    if (this.hasSequentialChars(password)) {
      errors.push('Password cannot contain sequential characters (e.g., 123, abc)')
    }

    // Check for repeated characters
    if (this.hasRepeatedChars(password)) {
      errors.push('Password cannot contain repeated characters (e.g., 111, aaa)')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Check if password contains sequential characters
   */
  private hasSequentialChars(password: string): boolean {
    const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789']
    const reverseSequences = sequences.map((seq) => seq.split('').reverse().join(''))

    for (const sequence of [...sequences, ...reverseSequences]) {
      for (let i = 0; i < password.length - 2; i++) {
        const slice = password.slice(i, i + 3).toLowerCase()
        if (sequence.includes(slice)) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Check if password has too many repeated characters
   */
  private hasRepeatedChars(password: string): boolean {
    let consecutiveCount = 1
    let maxConsecutive = 1

    for (let i = 1; i < password.length; i++) {
      if (password[i] === password[i - 1]) {
        consecutiveCount++
        maxConsecutive = Math.max(maxConsecutive, consecutiveCount)
      } else {
        consecutiveCount = 1
      }
    }

    return maxConsecutive >= 3
  }

  /**
   * Calculate password complexity score (0-100)
   */
  calculatePasswordStrength(password: string): number {
    let score = 0

    // Length bonus
    if (password.length >= 12) score += 20
    if (password.length >= 16) score += 10
    if (password.length >= 20) score += 10

    // Character variety bonus
    if (/(?=.*[a-z])/.test(password)) score += 10
    if (/(?=.*[A-Z])/.test(password)) score += 10
    if (/(?=.*\d)/.test(password)) score += 10
    if (/(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) score += 15
    if (/(?=.*[^A-Za-z\d@$!%*?&])/.test(password)) score += 10 // Other special chars

    // No weak patterns
    if (!PasswordSecurityService.WEAK_PASSWORDS.some((wp) => password.toLowerCase().includes(wp))) {
      score += 15
    }

    return Math.min(score, 100)
  }

  /**
   * Generate a secure random password
   */
  generateSecurePassword(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '@$!%*?&'
    const allChars = lowercase + uppercase + numbers + symbols

    let password = ''

    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]

    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Shuffle the password
    return this.shuffleString(password)
  }

  /**
   * Shuffle string characters
   */
  private shuffleString(str: string): string {
    const array = str.split('')
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array.join('')
  }
}
