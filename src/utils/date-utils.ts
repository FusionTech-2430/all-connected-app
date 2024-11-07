// utils/dateUtils.ts
export const formatFriendlyDate = (timestamp: number): string => {
    if (isNaN(timestamp)) {
      return 'Fecha inválida';
    }
  
    const now = new Date();
    const messageDate = new Date(timestamp);
  
    const diffInMilliseconds = now.getTime() - messageDate.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
  
    if (diffInSeconds < 60) {
      return 'Justo ahora';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minutos`;
    } else if (diffInHours < 24) {
      return `Hoy`;
    } else if (diffInDays === 1) {
      return 'Ayer';
    } else if (diffInDays < 7) {
      return `Esta semana`;
    } else if (diffInWeeks === 1) {
      return 'La semana pasada';
    } else if (diffInMonths === 1) {
      return 'El mes pasado';
    } else if (diffInMonths > 1 && diffInMonths < 12) {
      return `Hace ${diffInMonths} meses`;
    } else if (diffInYears === 1) {
      return 'El año pasado';
    } else if (diffInYears > 1) {
      return `Hace ${diffInYears} años`;
    } else {
      return 'Hace mucho tiempo';
    }
  };
  