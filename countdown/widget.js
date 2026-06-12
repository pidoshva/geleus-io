// Reunion in Paradise — iOS home screen widget (Scriptable)
// ---------------------------------------------------------
// iOS widgets need a native app, so this uses the free Scriptable app
// (App Store) to render one:
//   1. Install "Scriptable" from the App Store
//   2. Open it, tap "+", paste this entire file, name it "Paradise"
//   3. Long-press the home screen → add a Scriptable widget
//      (small or medium), then tap it while editing and choose
//      the "Paradise" script
// The widget shows days remaining over a random Maui photo, refreshes
// itself periodically, and opens geleus.io/countdown when tapped.

// Keep in sync with config.target in index.html
const TARGET = new Date(2026, 6, 24, 14, 0, 0); // July 24, 2026 2:00 PM
const PAGE_URL = "https://geleus.io/countdown/";
const PHOTOS_URL = "https://geleus.io/countdown/photos.js";

async function randomMauiPhoto() {
    try {
        const js = await new Request(PHOTOS_URL).loadString();
        const ids = [...js.matchAll(/id: '([^']+)'/g)].map(m => m[1]);
        const id = ids[Math.floor(Math.random() * ids.length)];
        const url = "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=800&h=400&q=70";
        return await new Request(url).loadImage();
    } catch (e) {
        return null; // offline — plain dark background
    }
}

const widget = new ListWidget();
widget.url = PAGE_URL;
widget.backgroundColor = new Color("#000000");

const photo = await randomMauiPhoto();
if (photo) {
    widget.backgroundImage = photo;
    // darken for text legibility
    const shade = new LinearGradient();
    shade.colors = [new Color("#000000", 0.55), new Color("#000000", 0.25)];
    shade.locations = [0, 1];
    widget.backgroundGradient = shade;
}

const diff = TARGET.getTime() - Date.now();

if (diff <= 0) {
    const done = widget.addText("Aloha — it's island time 🌴");
    done.font = Font.boldSystemFont(18);
    done.textColor = Color.white();
    done.centerAlignText();
} else if (diff < 86400000) {
    // Final 24 hours: live HH:MM:SS timer (iOS animates this in real time)
    const title = widget.addText("REUNION IN PARADISE");
    title.font = Font.mediumMonospacedSystemFont(10);
    title.textColor = new Color("#ffffff", 0.85);
    title.centerAlignText();

    widget.addSpacer(8);

    const timer = widget.addDate(TARGET);
    timer.applyTimerStyle();
    timer.font = Font.boldMonospacedSystemFont(30);
    timer.textColor = Color.white();
    timer.centerAlignText();

    widget.addSpacer(8);

    const eta = widget.addText("today · 2:00 PM");
    eta.font = Font.regularMonospacedSystemFont(9);
    eta.textColor = new Color("#ffffff", 0.6);
    eta.centerAlignText();
} else {
    const title = widget.addText("REUNION IN PARADISE");
    title.font = Font.mediumMonospacedSystemFont(10);
    title.textColor = new Color("#ffffff", 0.85);
    title.centerAlignText();

    widget.addSpacer(6);

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const big = widget.addText(String(days));
    big.font = Font.boldMonospacedSystemFont(38);
    big.textColor = Color.white();
    big.centerAlignText();

    const sub = widget.addText(days === 1 ? "day" : "days");
    sub.font = Font.mediumMonospacedSystemFont(11);
    sub.textColor = new Color("#ffffff", 0.75);
    sub.centerAlignText();

    widget.addSpacer(5);

    const pad = n => (n < 10 ? "0" : "") + n;
    const hm = widget.addText(pad(hours) + " h  " + pad(minutes) + " m");
    hm.font = Font.boldMonospacedSystemFont(14);
    hm.textColor = new Color("#ffffff", 0.9);
    hm.centerAlignText();

    widget.addSpacer(5);

    const eta = widget.addText("Jul 24 · 2:00 PM");
    eta.font = Font.regularMonospacedSystemFont(9);
    eta.textColor = new Color("#ffffff", 0.6);
    eta.centerAlignText();
}

// ask iOS to refresh every ~15 minutes so hours/minutes stay current
// (the photo rotates with each refresh too)
widget.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);

if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    await widget.presentSmall();
}
Script.complete();
