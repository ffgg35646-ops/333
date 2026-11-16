import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const TOKEN_KEY = "khadamati.admin.token";

function apiUrl(path: string) {
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL || "";
  if (Platform.OS === "web") return (configured || "") + path;
  if (!configured) throw new Error("يجب ضبط EXPO_PUBLIC_API_BASE_URL لتطبيقات الهاتف بعد نشر الـ API.");
  return configured.replace(/\/$/, "") + path;
}

export async function getAdminToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setAdminToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearAdminToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, authenticated = false): Promise<T> {
  const token = authenticated ? await getAdminToken() : null;
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "حدث خطأ أثناء الاتصال بالخادم.");
  return payload as T;
}
