// src/utils/auth.ts
export function checkAuth(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Декодируем payload JWT
        const expiration = payload.exp * 1000; // Преобразуем время истечения в миллисекунды
        return Date.now() < expiration; // Если текущее время меньше времени истечения, токен действителен
    } catch (error) {
        return false; // Если произошла ошибка (например, токен поврежден), считаем, что пользователь не авторизован
    }
}
