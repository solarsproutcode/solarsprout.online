import kaplay from "kaplay";
import { loadAssets } from "./loader.js";

const k = kaplay({
    width: 1920,
    height: 1080,
    font: "sans-serif",
    letterbox: true, // letterbox the canvas to fit the window
    background: "#000000",
})
k.loadRoot("./");

k.setLayers([
    "Background",
    "Game",
    "Foreground",
], "Game"); // Game is the default layer

loadAssets(k);