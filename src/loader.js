import { addCRTOverlay } from "./crt_overlay.js";

// Images are cropped to their content; "at" is where the crop's top-left corner sits in the
// full 1152×648 scene. Assets without "at" fill the whole scene and start at 0, 0.
function sceneOffset(k, asset) {
    return k.vec2(asset.at?.x ?? 0, asset.at?.y ?? 0);
}

// List of hover animation frames
function hoverFrames(folder, prefix, count) {
    return Array.from({ length: count }, (_, i) => `sprites/${folder}/${prefix}${i + 1}.png`);
}

// Constants for defining assets
const GAME_STATIC_ASSETS = [
    { name: "game_bg", png: "backgrounds/CRT/Background.png" },
    { name: "clouds", png: "backgrounds/CRT/Clouds.png", scrollSpeed: 15 }, // drifts right, art pixels per second
    { name: "grass", png: "backgrounds/CRT/Grass.png", at: { x: 177, y: 468 } },
    { name: "grass2", png: "backgrounds/CRT/Grass2.png", at: { x: 564, y: 526 } },
    { name: "large_rock", png: "backgrounds/CRT/LargeRock.png", at: { x: 823, y: 24 } },
    { name: "news_ground", png: "backgrounds/CRT/NewsGround.png", at: { x: 533, y: 276 } },
    { name: "fence", png: "backgrounds/CRT/Fence.png", at: { x: 191, y: 76 } },
    { name: "sign", png: "backgrounds/CRT/Sign.png", at: { x: 245, y: 407 } }
];
const GAME_CLICKABLE_ASSETS = [ // Mark bounding box for clickable assets
    { name: "arcade", png: "sprites/CRT/Arcade.png", at: { x: 602, y: 9 }, bbox: { x: 601, y: 9, w: 319, h: 187 },
        url: "https://solarsprout.itch.io/",
        frames: hoverFrames("Arcade", "Arcade", 5),
        hoverSound: "sounds/Arcade.wav", hoverSoundLoop: true, hoverVolume: 0.2 },
    { name: "art_gallery", png: "sprites/CRT/ArtGallery.png", at: { x: 0, y: 0 }, bbox: { x: 0, y: 0, w: 275, h: 355 },
        url: "https://ko-fi.com/solarsproutshop/shop",
        frames: hoverFrames("ArtGallery", "ArtGallery", 3), loop: false,
        hoverSound: "sounds/Door Creak.wav" },
    { name: "dj", png: "sprites/CRT/DJ.png", at: { x: 904, y: 0 }, bbox: { x: 904, y: 0, w: 248, h: 342 },
        url: "https://open.spotify.com/artist/6LskQdnSNWP1q6QyxlvRaL?si=kV8kSIVoTMKmIfX7Zwt1DQ",
        frames: hoverFrames("DJ", "DJ", 5),
        hoverSound: "sounds/Cello.wav", hoverSoundLoop: true, hoverVolume: 0.35 },
    { name: "fountain", png: "sprites/CRT/Fountain.png", at: { x: 0, y: 557 }, bbox: { x: 0, y: 556, w: 70, h: 92 } },
    { name: "mailbox", png: "sprites/CRT/Mailbox2.png", at: { x: 987, y: 400 }, bbox: { x: 986, y: 414, w: 85, h: 99 },
        url: "https://discord.gg/C78YcT5JN",
        frames: hoverFrames("Mailbox", "Mailbox", 5), loop: false,
        hoverSound: "sounds/Whistle.wav", hoverVolume: 0.7 },
    { name: "movie_theater", png: "sprites/CRT/MovieTheater.png", at: { x: 242, y: 0 }, bbox: { x: 241, y: 0, w: 346, h: 223 },
        url: "https://www.youtube.com/@SolarSproutFilms",
        frames: hoverFrames("MovieTheater", "MovieTheater", 6), loop: false,
        hoverSound: "sounds/Camera.wav" },
    { name: "news_stand", png: "sprites/CRT/NewsStand.png", at: { x: 607, y: 242 }, bbox: { x: 607, y: 241, w: 160, h: 144 },
        url: "https://ko-fi.com/solarsproutshop/posts",
        hoverScale: 1.08, // grows 8% on hover
        hoverSound: "sounds/Typewriter.wav", hoverSoundLoop: true, hoverVolume: 0.6 },
    { name: "robot", png: "sprites/CRT/Robot.png", at: { x: 294, y: 234 }, bbox: { x: 337, y: 234, w: 74, h: 128 },
        url: "https://github.com/solarsproutcode",
        frames: hoverFrames("Robot", "Robot", 8),
        hoverSound: "sounds/Skateboard.wav", hoverSoundLoop: true, hoverVolume: 2.5 },
    { name: "tree", png: "sprites/CRT/Tree.png", at: { x: 908, y: 9 }, bbox: { x: 907, y: 9, w: 65, h: 104 } },
]

// Load methods
export function loadAssets(k) {
    k.loadMusic("BackgroundMusic", "sounds/Website_1.mp3");
    k.loadSprite("crt", "backgrounds/CRT/CRT.png");
    loadGameAssets(k);
    k.onLoad(() => {
        const { screenPos, screenSize } = addCRT(k);
        addGameAssets(k, screenPos, screenSize);
        addCRTOverlay(k);
        addMusic(k);
    });
}

function loadGameAssets(k) {
    for (const asset of GAME_STATIC_ASSETS) {
        k.loadSprite(asset.name, asset.png);
    }
    for (const asset of GAME_CLICKABLE_ASSETS) {
        if (asset.frames) {
            k.loadSprite(asset.name, asset.frames, {
                anims: { hover: { from: 0, to: asset.frames.length - 1, speed: 8, loop: asset.loop ?? true } }, // loops unless the asset sets loop: false
            });
        } else {
            k.loadSprite(asset.name, asset.png);
        }
        if (asset.hoverSound) {
            k.loadSound(`${asset.name}_hover`, asset.hoverSound);
        }
    }
}

// Add methods

function addGameAssets(k, screenPos, screenSize) {
    const game_bg = k.getSprite("game_bg").data; // 640×360
    // Same scale on both axes so the art keeps its 16:9 shape, centered inside CRT_SCREEN_RECT
    const scale = Math.min(screenSize.x / game_bg.width, screenSize.y / game_bg.height);
    const gameSize = k.vec2(game_bg.width, game_bg.height).scale(scale);
    const gamePos = screenPos.add(screenSize.sub(gameSize).scale(0.5)); // Center the art inside the screen
    for (const asset of GAME_STATIC_ASSETS) {
        if (asset.scrollSpeed) {
            addScrollingAsset(k, asset, gamePos, scale);
            continue;
        }
        k.add([
            k.pos(gamePos.add(sceneOffset(k, asset).scale(scale))),
            k.sprite(asset.name),
            k.scale(scale),
            k.layer("Game"),
        ]);
    }
    const links = []; // objects that open a link when clicked
    // Phones and tablets can't hover, so there the first tap previews (animation + sound)
    // and a second tap on the same object opens its link
    const isTouchOnly = window.matchMedia("(hover: none)").matches;
    let selected = null; // the object tapped once, waiting for a second tap
    for (const asset of GAME_CLICKABLE_ASSETS) {
        // bbox is in scene pixels; the sprite is cropped, so measure the click area from the crop's corner
        const offset = sceneOffset(k, asset);
        const basePos = gamePos.add(offset.scale(scale));
        const rect = new k.Rect(k.vec2(asset.bbox.x, asset.bbox.y).sub(offset), asset.bbox.w, asset.bbox.h);
        const obj = k.add([
            k.pos(basePos),
            k.sprite(asset.name),
            k.scale(scale),
            k.area({ shape: rect }),
            k.layer("Game"),
        ]);
        if (asset.url) {
            obj.onClick(() => {
                if (!isTouchOnly || selected === obj) {
                    window.open(asset.url, "_blank"); // open link in a new tab
                } else {
                    selected = obj; // first tap on touch: just preview
                }
            });
            // Tapping anywhere else ends the hover, so the next tap here is a first tap again
            obj.onHoverEnd(() => {
                if (selected === obj) selected = null;
            });
            links.push(obj);
        }
        if (asset.frames) {
            obj.onHover(() => obj.play("hover"));
            obj.onHoverEnd(() => {
                obj.stop();
                obj.frame = 0; // back to the first frame
            });
        }
        if (asset.hoverScale) {
            // Sprites scale from their top-left corner, so shift it while scaling
            // to keep the center of its bbox in the same place on screen
            const center = k.vec2(asset.bbox.x + asset.bbox.w / 2, asset.bbox.y + asset.bbox.h / 2).sub(offset);
            const bigScale = scale * asset.hoverScale;
            obj.onHover(() => {
                obj.scaleTo(bigScale);
                obj.pos = basePos.sub(center.scale(bigScale - scale));
            });
            obj.onHoverEnd(() => {
                obj.scaleTo(scale);
                obj.pos = basePos;
            });
        }
        if (asset.hoverSound) {
            let sound = null;
            obj.onHover(() => sound = k.play(`${asset.name}_hover`, {
                loop: asset.hoverSoundLoop,
                volume: asset.hoverVolume ?? 1, // full volume unless the asset sets hoverVolume
            }));
            if (asset.hoverSoundLoop) {
                obj.onHoverEnd(() => sound?.stop()); // looping sounds stop when the mouse leaves; one-time sounds play to the end
            }
        }
    }
    // Every frame: hand cursor if the mouse is over a link, normal arrow otherwise
    k.onUpdate(() => {
        const overLink = links.some((obj) => obj.isHovering());
        k.setCursor(overLink ? "pointer" : "default");
    });
}

// Scrolls a full-scene sprite left to right forever, clipped to the game art so it never covers the CRT
function addScrollingAsset(k, asset, gamePos, scale) {
    const { width, height } = k.getSprite(asset.name).data;
    const area = k.add([
        k.pos(gamePos),
        k.rect(width, height),
        k.scale(scale),
        k.mask("intersect"), // only children inside this rect are drawn
        k.layer("Game"),
    ]);
    // Two copies side by side: once the first has moved a full width, it wraps back to 0
    // and the second takes its place, so the loop has no visible jump
    const first = area.add([k.pos(0, 0), k.sprite(asset.name)]);
    const second = area.add([k.pos(-width, 0), k.sprite(asset.name)]);
    area.onUpdate(() => {
        first.pos.x = (first.pos.x + asset.scrollSpeed * k.dt()) % width;
        second.pos.x = first.pos.x - width;
    });
}

// Browsers block sound until the visitor interacts, so start the music on the first click or key press
function addMusic(k) {
    const music = k.play("BackgroundMusic", { volume: 0.5, loop: true, paused: true });
    // Use the browser's own events, not KAPLAY's: KAPLAY runs its input handlers a frame later,
    // and phones (iPhone Safari especially) only allow audio to start during the tap itself
    const events = ["mousedown", "touchend", "keydown"];
    const startMusic = () => {
        music.play();
        events.forEach((e) => window.removeEventListener(e, startMusic)); // only start once
    };
    events.forEach((e) => window.addEventListener(e, startMusic));
}

function addCRT(k) {
    const CRT_SCREEN_RECT = { x: 0.103, y: 0.122, w: 0.60, h: 0.618 }; // box of the actual TV screen
    const crt = k.getSprite("crt").data;
    const crtScale = Math.max(k.width() / crt.width, k.height() / crt.height); // Scale to fit the screen
    const crtTopLeft = k.center().sub(k.vec2(crt.width, crt.height).scale(crtScale / 2));
    const screenPos = crtTopLeft.add(
        k.vec2(crt.width * CRT_SCREEN_RECT.x, crt.height * CRT_SCREEN_RECT.y).scale(crtScale)
    );
    const screenSize = k.vec2(crt.width * CRT_SCREEN_RECT.w, crt.height * CRT_SCREEN_RECT.h).scale(crtScale);

    k.add([
        k.pos(k.center()), 
        k.anchor("center"), // Point of scale and rotation
        k.sprite("crt"),
        k.scale(crtScale),
        k.layer("Background"),
    ]);
    return { screenPos, screenSize };
}