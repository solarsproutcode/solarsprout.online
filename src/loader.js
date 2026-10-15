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
    { name: "arcade", png: "sprites/CRT/Arcade.png", bbox: { x: 334, y: 5, w: 177, h: 104 } },
    { name: "art_gallery", png: "sprites/CRT/ArtGallery.png", bbox: { x: 0, y: 0, w: 153, h: 197 } },
    { name: "dj", png: "sprites/CRT/DJ.png", bbox: { x: 502, y: 0, w: 138, h: 190 } },
    { name: "fountain", png: "sprites/CRT/Fountain.png", bbox: { x: 0, y: 309, w: 39, h: 51 } },
    { name: "mailbox", png: "sprites/CRT/Mailbox2.png", bbox: { x: 548, y: 230, w: 47, h: 55 } },
    { name: "movie_theater", png: "sprites/CRT/MovieTheater.png", bbox: { x: 134, y: 0, w: 192, h: 124 } },
    { name: "news_stand", png: "sprites/CRT/NewsStand.png", bbox: { x: 337, y: 134, w: 89, h: 80 } },
    { name: "robot", png: "sprites/CRT/Robot.png", bbox: { x: 187, y: 130, w: 41, h: 71 } },
    { name: "tree", png: "sprites/CRT/Tree.png", bbox: { x: 504, y: 5, w: 36, h: 58 } },
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
        k.play("BackgroundMusic", { volume: 0.5, loop: true });
    });
}

function loadGameAssets(k) {
    for (const asset of GAME_STATIC_ASSETS) {
        k.loadSprite(asset.name, asset.png);
    }
    for (const asset of GAME_CLICKABLE_ASSETS) {
        k.loadSprite(asset.name, asset.png);
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
    for (const asset of GAME_CLICKABLE_ASSETS) {
        const rect = new k.Rect(k.vec2(asset.bbox.x, asset.bbox.y), asset.bbox.w, asset.bbox.h);
        k.add([
            k.pos(gamePos),
            k.sprite(asset.name),
            k.scale(scale),
            k.area({ shape: rect }),
            k.layer("Game"),
        ]);
    }
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