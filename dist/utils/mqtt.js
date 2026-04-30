"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttClient = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
exports.mqttClient = mqtt_1.default.connect("mqtt://broker.hivemq.com");
exports.mqttClient.on("connect", () => {
    console.log("MQTT connected");
});
exports.mqttClient.on("error", (err) => {
    console.error("MQTT error:", err);
});
