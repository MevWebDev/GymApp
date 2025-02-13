# Plan pokazywania

## HTTP

    - /backend/routes
    8x get
    4x post
    2x patch
    3x delete

    - wyszukiwanie wzorcem jest w /exercises

- klientem jest cała apka

## MQTT

    - symulator kroków
    - zapis kroków jako log w plikach
    - pobranie lokacji i zapis lokacji w plikach

## WebSocket

    - Chat
    - Powiadomienie o nowym planie
    - Live users

## Inne

    - konfiguracja protokołow backendowych do uzycia na froncie (hook useWebSocket oraz client w page.tsx )
    - zapisywanie danych do logów
    - wykorzystanie bazy danych (supabase)
    - szyfrowanie haseł (bcrypt)
    - role (zalogowany może dodawać plany i  korzystać z czatu)
