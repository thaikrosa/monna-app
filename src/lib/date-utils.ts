export function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  
  // Adjust for day of month
  if (now.getDate() < birth.getDate()) {
    months--;
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Less than 1 month
  if (years === 0 && months === 0) {
    const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Recém-nascido';
    if (days === 1) return '1 dia';
    return `${days} dias`;
  }
  
  // Less than 1 year
  if (years === 0) {
    return months === 1 ? '1 mês' : `${months} meses`;
  }
  
  // Exactly N years
  if (months === 0) {
    return years === 1 ? '1 ano' : `${years} anos`;
  }
  
  // Years and months
  const yearStr = years === 1 ? '1 ano' : `${years} anos`;
  const monthStr = months === 1 ? '1 mês' : `${months} meses`;
  return `${yearStr} e ${monthStr}`;
}
