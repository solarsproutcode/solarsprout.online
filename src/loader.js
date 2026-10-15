import { addCRTOverlay } from "./crt_overlay.js";

// Constants for defining assets
const GAME_STATIC_ASSETS = [
    { name: "game_bg", png: "backgrounds/CRT/Background.png" },
    { name: "clouds", png: "backgrounds/CRT/Clouds.png" },
    { name: "grass", png: "backgrounds/CRT/Grass.png" },
    { name: "grass2", png: "backgrounds/CRT/Grass2.png" },
    { name: "large_rock", png: "backgrounds/CRT/LargeRock.png" },
    { name: "news_ground", png: "backgrounds/CRT/NewsGround.png" },
    { name: "fence", png: "backgrounds/CRT/Fence.png" },
    { name: "sign", png: "backgrounds/CRT/Sign.png" }
];
const GAME_CLICKABLE_ASSETS = [ // Mark bounding box for clickable assets
    { name: "arcade", png: "sprites/CRT/Arcade.png", bbox: { x: 601, y: 9, w: 319, h: 187 },
        url: "https://solarsprout.itch.io/" },
    { name: "art_gallery", png: "sprites/CRT/ArtGallery.png", bbox: { x: 0, y: 0, w: 275, h: 355 },
        url: "https://ko-fi.com/solarsproutshop/shop" },
    { name: "dj", png: "sprites/CRT/DJ.png", bbox: { x: 904, y: 0, w: 248, h: 342 },
        url: "https://open.spotify.com/artist/6LskQdnSNWP1q6QyxlvRaL?si=kV8kSIVoTMKmIfX7Zwt1DQ" },
    { name: "fountain", png: "sprites/CRT/Fountain.png", bbox: { x: 0, y: 556, w: 70, h: 92 } },
    { name: "mailbox", png: "sprites/CRT/Mailbox2.png", bbox: { x: 986, y: 414, w: 85, h: 99 },
        url: "https://discord.gg/C78YcT5JN" },
    { name: "movie_theater", png: "sprites/CRT/MovieTheater.png", bbox: { x: 241, y: 0, w: 346, h: 223 },
        url: "https://www.youtube.com/@SolarSproutFilms" },
    { name: "news_stand", png: "sprites/CRT/NewsStand.png", bbox: { x: 607, y: 241, w: 160, h: 144 },
        url: "https://ko-fi.com/solarsproutshop/posts" },
    { name: "robot", png: "sprites/CRT/Robot.png", bbox: { x: 337, y: 234, w: 74, h: 128 },
        url: "https://github.com/solarsproutcode",
        frames: [ // hover animation frames
            "sprites/Robot/Robot1.png", "sprites/Robot/Robot2.png", "sprites/Robot/Robot3.png", "sprites/Robot/Robot4.png",
            "sprites/Robot/Robot5.png", "sprites/Robot/Robot6.png", "sprites/Robot/Robot7.png", "sprites/Robot/Robot8.png",
        ] },
    { name: "tree", png: "sprites/CRT/Tree.png", bbox: { x: 907, y: 9, w: 65, h: 104 } },
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
                anims: { hover: { from: 0, to: asset.frames.length - 1, speed: 8, loop: true } },
            });
        } else {
            k.loadSprite(asset.name, asset.png);
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
        k.add([
            k.pos(gamePos),
            k.sprite(asset.name),
            k.scale(scale),  
            k.layer("Game"),
        ]);
    }
    const links = []; // objects that open a link when clicked
    for (const asset of GAME_CLICKABLE_ASSETS) {
        const rect = new k.Rect(k.vec2(asset.bbox.x, asset.bbox.y), asset.bbox.w, asset.bbox.h);
        const obj = k.add([
            k.pos(gamePos),
            k.sprite(asset.name),
            k.scale(scale),
            k.area({ shape: rect }),
            k.layer("Game"),
        ]);
        if (asset.url) {
            obj.onClick(() => window.open(asset.url, "_blank")); // open link in a new tab
            links.push(obj);
        }
        if (asset.frames) {
            obj.onHover(() => obj.play("hover"));
            obj.onHoverEnd(() => {
                obj.stop();
                obj.frame = 0; // back to the first frame
            });
        }
    }
    // Every frame: hand cursor if the mouse is over a link, normal arrow otherwise
    k.onUpdate(() => {
        const overLink = links.some((obj) => obj.isHovering());
        k.setCursor(overLink ? "pointer" : "default");
    });
}

// Browsers block sound until the visitor interacts, so start the music on the first click or key press
function addMusic(k) {
    const music = k.play("BackgroundMusic", { volume: 0.5, loop: true, paused: true });
    const startMusic = () => {
        music.play();
        clickEvent.cancel(); // only start once
        keyEvent.cancel();
    };
    const clickEvent = k.onMousePress(startMusic);
    const keyEvent = k.onKeyPress(startMusic);
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