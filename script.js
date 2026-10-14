// ==========================================
// KOHTA A: Perusrunko ja muuttujat
// ==========================================

const kurssi = "Johdatus sovelluskehitykseen";
let osallistujat = 25;

console.log("Hei maailma! Kurssi:", kurssi);
console.log("Osallistujamäärä:", osallistujat);


// ==========================================
// KOHTA B: Ehtolause
// ==========================================

if (osallistujat > 20) {
    console.log("Ryhmä on iso!");
} else {
    console.log("Ryhmä on pieni.");
}


// ==========================================
// KOHTA C: Laskurifunktio
// ==========================================

function laskeAlv(hinta) {
    const alv = 0.24;
    const uusiHinta = hinta + (hinta * alv);

    return uusiHinta;
}

let tuoteHinta = 10;
let hintaAlvilla = laskeAlv(tuoteHinta);

console.log("Hinta ilman alvia:", tuoteHinta);
console.log("Hinta alvin kanssa:", hintaAlvilla);


// ==========================================
// KOHTA D: Taulukko ja silmukka
// ==========================================

const tuotteet = [
    "ryhmäliikuntaohjaus",
    "tilaustunnit",
    "luennot"
];

// for-silmukka
for (let i = 0; i < tuotteet.length; i++) {
    console.log("Tuote:", tuotteet[i]);
}

// forEach-silmukka
tuotteet.forEach(function(tuote) {
    console.log("forEach:", tuote);
});


// ==========================================
// KOHTA E: PÄIVÄN RUOKAVINKKI
// Avoin rajapinta: TheMealDB
// ==========================================

const haeNappi = document.getElementById("haeNappi");
const tulos = document.getElementById("tulos");

if (haeNappi !== null && tulos !== null) {

    haeNappi.addEventListener("click", function() {

        // Näytetään käyttäjälle latausviesti
        tulos.textContent = "Haetaan päivän ruokavinkkiä...";
        tulos.className = "lataus";

        // Estetään uudet painallukset haun ajaksi
        haeNappi.disabled = true;

        // Haetaan satunnainen ruoka avoimesta rajapinnasta
        fetch("https://www.themealdb.com/api/json/v1/1/random.php")

            .then(function(response) {

                if (!response.ok) {
                    throw new Error("Ruokavinkin hakeminen epäonnistui.");
                }

                return response.json();
            })

            .then(function(data) {

                // Tarkistetaan, löytyikö ruoka
                if (!data.meals || data.meals.length === 0) {
                    throw new Error("Ruokaa ei löytynyt.");
                }

                // Rajapinta palauttaa yhden satunnaisen ruoan
                const ruoka = data.meals[0];

                // Tyhjennetään aiempi sisältö
                tulos.replaceChildren();
                tulos.className = "";

                // Luodaan ruoan otsikko
                const otsikko = document.createElement("h3");
                otsikko.textContent = ruoka.strMeal;
                tulos.appendChild(otsikko);

                // Luodaan ruoan kuva
                const kuva = document.createElement("img");
                kuva.src = ruoka.strMealThumb;
                kuva.alt = "Kuva ruoasta " + ruoka.strMeal;
                kuva.loading = "lazy";
                tulos.appendChild(kuva);

                // Lisätään lyhyt ruokavinkki
                const vinkki = document.createElement("p");
                vinkki.textContent =
                    "Kokeile tätä ruokaideaa osana monipuolista ruokavaliota.";
                tulos.appendChild(vinkki);

                // Lisätään linkki ruoan valmistusohjeeseen, jos saatavilla
                if (ruoka.strSource || ruoka.strYoutube) {

                    const linkki = document.createElement("a");

                    linkki.href = ruoka.strSource || ruoka.strYoutube;
                    linkki.textContent = "Katso ruoan valmistusohje";
                    linkki.target = "_blank";
                    linkki.rel = "noopener noreferrer";

                    tulos.appendChild(linkki);
                }
            })

            .catch(function(error) {

                // Virhe näkyy konsolissa ja verkkosivulla
                console.error("Virhe ruokavinkin haussa:", error);

                tulos.textContent =
                    "Ruokavinkin hakeminen epäonnistui. Tarkista internet-yhteys ja yritä uudelleen.";

                tulos.className = "virhe";
            })

            .finally(function() {

                // Palautetaan painike käyttöön
                haeNappi.disabled = false;
            });
    });
}


// ==========================================
// AJANVARAUSPAINIKKEEN TOIMINTO
// ==========================================

const nappi = document.getElementById("ajanvarausNappi");

if (nappi !== null) {

    nappi.addEventListener("click", function() {

        console.log("Ajanvarausnappia painettiin!");

        alert("Siirryt ajanvaraukseen!");
    });
}


// ==========================================
// RYHMÄLIIKUNTATUNTIEN SUODATUS
// ==========================================

const kaupunkiValinta = document.getElementById("kaupunkiValinta");
const paivaValinta = document.getElementById("paivaValinta");
const tuntiKortit = document.querySelectorAll(".tunti-kortti");
const tuntiMaara = document.getElementById("tuntiMaara");

function suodataTunnit() {

    // Tarkistetaan, että tarvittavat HTML-elementit löytyvät
    if (
        kaupunkiValinta === null ||
        paivaValinta === null ||
        tuntiMaara === null
    ) {
        return;
    }

    const valittuKaupunki = kaupunkiValinta.value;
    const valittuPaiva = paivaValinta.value;

    let nakyviaTunteja = 0;

    // Käydään kaikki tuntikortit läpi
    tuntiKortit.forEach(function(kortti) {

        const kaupunki = kortti.dataset.kaupunki;
        const paiva = kortti.dataset.paiva;

        // Tarkistetaan valittu paikkakunta
        const kaupunkiSopii =
            valittuKaupunki === "kaikki" ||
            kaupunki === valittuKaupunki;

        // Tarkistetaan valittu viikonpäivä
        const paivaSopii =
            valittuPaiva === "kaikki" ||
            paiva === valittuPaiva;

        // Näytetään vain hakuehtoihin sopivat tunnit
        if (kaupunkiSopii && paivaSopii) {
            kortti.hidden = false;
            nakyviaTunteja++;
        } else {
            kortti.hidden = true;
        }
    });

    // Näytetään hakutulosten määrä
    if (nakyviaTunteja === 0) {
        tuntiMaara.textContent =
            "Valituilla hakuehdoilla ei löytynyt tunteja.";
    } else {
        tuntiMaara.textContent =
            "Näytetään " + nakyviaTunteja + " tuntia.";
    }
}


// Käynnistetään suodatus valintojen muuttuessa
if (
    kaupunkiValinta !== null &&
    paivaValinta !== null &&
    tuntiMaara !== null
) {
    kaupunkiValinta.addEventListener("change", suodataTunnit);
    paivaValinta.addEventListener("change", suodataTunnit);

    // Näytetään aluksi kaikki tunnit
    suodataTunnit();
}