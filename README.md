# Flutry

<p align="center">
  <img src="assets/logo.png" alt="Flutry Logo" width="150" />
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  </a>
</p>

Ez a projekt egy fejlett, rugalmas és könnyen bővíthető REST API környezet Node.js és TypeScript alapokon. Az API célja, hogy egy univerzális backend megoldást biztosítson, amely automatikus routinggal, modellek kezelésével, többféle adatbázis támogatással és biztonsági funkciókkal rendelkezik.

---

## Tartalomjegyzék

- [Főbb jellemzők](#főbb-jellemzők)
- [Technológiai stack](#technológiai-stack)
- [Funkcionalitás](#funkcionalitás)
- [API végpontok](#api-végpontok)
- [Hitelesítés és biztonság](#hitelesítés-és-biztonság)
- [Hibakezelés](#hibakezelés)
- [Teljesítmény és korlátozások](#teljesítmény-és-korlátozások)
- [Telepítés és futtatás](#telepítés-és-futtatás)
- [Fejlesztői eszközök és jövőbeli fejlesztések](#fejlesztői-eszközök-és-jövőbeli-fejlesztések)
- [Licenc](#licenc)

---

## Főbb jellemzők

- **Automatikus routing és modell kezelés**: Az API automatikusan kezeli a route-okat és az adatmodelleket, így gyorsan és egyszerűen bővíthető.
- **Több adatbázis támogatás**: MongoDB, Sequelize (relációs adatbázisok), Drizzle támogatás.
- **Biztonság**: JWT alapú hitelesítés és titkosítási megoldások.
- **Rugalmas web szerver választás**: Express.js és Fastify támogatás, igény szerint választható.
- **Hibakezelés**: Automatikus 404 és 500 hibakezelés, a szerver stabilitásának megőrzése érdekében.
- **Rate limiting**: Express.js esetén beépített rate limit védelem, Fastify esetén fejlesztés alatt.
- **Könnyű bővíthetőség**: Bármi, amit megírsz, integrálható a rendszerbe, legyen az új endpoint, modell vagy middleware.

---

## Technológiai stack

- **Backend**: Node.js, TypeScript
- **Web szerver**: Express.js, Fastify (választható)
- **Adatbázisok**: MongoDB, Sequelize (relációs adatbázisok), Drizzle (választható)
- **Hitelesítés**: JWT (JSON Web Token)
- **Rate limiting**: express-rate-limit (Express esetén)
- **Egyéb**: Automatikus routing és modell generálás

---

## Funkcionalitás

Ez az API nem egy egyszerű REST szolgáltatás, hanem egy komplex környezet, amely:

- Bármilyen adatmodellt képes kezelni, amit a fejlesztő definiál.
- Automatikusan létrehozza a hozzá tartozó végpontokat.
- Biztosítja a biztonságos hozzáférést JWT tokenekkel és titkosítással.
- Kezeli a hibákat és a nem létező útvonalakat automatikusan.
- Képes többféle adatbázis kezelővel együttműködni, így rugalmasan alkalmazható különböző projektekhez.
- Támogatja a különböző web szervereket, így könnyen váltható Express és Fastify között.

---

## API végpontok

- **Alapértelmezett egészségügyi ellenőrző végpont**:  
  `GET /health`  
  Visszaadja a szerver állapotát, hogy az API elérhető-e.

- **Hibakezelő végpontok**:
  - `404 Not Found`: Ha egy nem létező útvonalat hívnak meg.
  - `500 Internal Server Error`: Ha a szerveren váratlan hiba történik.

---

## Hitelesítés és biztonság

- **JWT alapú hitelesítés**: Az API támogatja a JSON Web Token alapú hitelesítést, amely biztonságos és széles körben használt megoldás.
- **Titkosítás**: A rendszer beépített titkosítási mechanizmusokat tartalmaz, de lehetőség van további egyedi megoldások integrálására.
- **Rugalmas bővíthetőség**: Az alapvető funkciók és infrastruktúra egy stabil, külső npm csomagra épül, amelyeket nem célszerű módosítani. Ehelyett a rendszer úgy van kialakítva, hogy könnyedén lehessen hozzáadni teljesen egyedi, saját fejlesztésű hitelesítési, jogosultsági vagy egyéb üzleti logikákat, anélkül, hogy az alapokat érintenénk. Így a projekt igényeihez igazítható, miközben megőrzi a stabilitást és a frissíthetőséget.

---

## Hibakezelés

- **Automatikus 404 kezelés**: Ha egy nem létező útvonalat hívnak meg, az API automatikusan 404-es választ ad.
- **Automatikus 500 kezelés**: Váratlan szerverhibák esetén az API 500-as hibakódot ad vissza, miközben megakadályozza a szerver összeomlását.
- **Stabilitás**: A hibakezelés célja, hogy a szerver folyamatosan elérhető maradjon, még kritikus hibák esetén is.

---

## Teljesítmény és korlátozások

- **Rate limiting**: Az Express.js alapú szervereknél beépített rate limiting védelem van, amely megakadályozza a túlzott lekérdezéseket és védi az API-t a túlterheléstől. A rate limiting beállításai a /src/utils/ratelimit.ts fájlban találhatók.
- **Fastify esetén**: A rate limiting megoldás még fejlesztés alatt áll, hamarosan elérhető lesz.
- **Caching**: Jelenleg nincs beépített caching, de a rendszer könnyen bővíthető ilyen funkcióval.

---

## Telepítés és futtatás

```bash
npm install -g @flutry/cli
flutry new my-app
```

Vagy

```bash
npx @flutry/cli new my-app
```

A CLI részletes dokumentációját megtalálod a [Flutry CLI dokumentáció](https://flutry.com/docs/package/cli) oldalon.

---

## Fejlesztői eszközök és jövőbeli fejlesztések

- Jelenleg nincs Swagger vagy OpenAPI dokumentáció, azonban a [weboldalunk dokumentációjában](https://flutry.com/docs) részletes leírások és példakódok találhatók, amelyek segítik az API használatát és integrációját.
- SDK-k vagy Postman gyűjtemények jelenleg nem állnak rendelkezésre, de a rendszer automatikus routingja miatt könnyen tesztelhető bármilyen HTTP klienssel.
- A Fastify rate limiting fejlesztés alatt áll, hamarosan elérhető lesz.

---

## Licenc (MIT)

Ez a projekt szabadon használható és módosítható a saját igényeid szerint.
Ha nyilvánosan megosztod, kérlek tüntesd fel a szerzőt és a forrást.

---

Ha bármilyen kérdésed vagy javaslatod van, nyugodtan jelezd!

---

Köszönöm, hogy ezt a rendszert használod!
